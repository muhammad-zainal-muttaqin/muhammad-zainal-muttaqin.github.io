"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const ORT_VER = "1.20.1";
const ORT_CDN = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VER}/dist/`;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const MODEL_URL = `${BASE}/models/ffb-detector-yolo26n.onnx`;
const NAMES = ["B1", "B2", "B3", "B4"]; // SawitMVC ripeness grades, B1 ripe -> B4 unripe
const VARS = { B1: "var(--b1)", B2: "var(--b2)", B3: "var(--b3)", B4: "var(--b4)", Bunch: "var(--palm-box)" };
const SAMPLES = [5, 4, 1, 2, 3].map((i) => ({ key: `palm-${i}`, src: `${BASE}/samples/palm-${i}.jpg`, thumb: `${BASE}/samples/palm-${i}-thumb.jpg` }));
const S = 640;

let sessionPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.ort) return resolve();
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = () => reject(new Error("Could not load ONNX Runtime"));
    document.head.appendChild(s);
  });
}

async function fetchWithProgress(url, onProgress) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Model download failed (${res.status})`);
  const total = Number(res.headers.get("content-length")) || 9_795_447;
  const reader = res.body.getReader();
  const chunks = []; let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value); got += value.length; onProgress(Math.min(1, got / total));
  }
  const buf = new Uint8Array(got); let o = 0;
  for (const c of chunks) { buf.set(c, o); o += c.length; }
  return buf;
}

function getSession(onProgress) {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const gpu = typeof navigator !== "undefined" && "gpu" in navigator;
      await loadScript(`${ORT_CDN}${gpu ? "ort.webgpu.min.js" : "ort.min.js"}`);
      window.ort.env.wasm.wasmPaths = ORT_CDN;
      const bytes = await fetchWithProgress(MODEL_URL, onProgress);
      // One warm-up run so the first timing shown excludes shader/kernel compilation.
      const warm = async (s) => {
        await s.run({ [s.inputNames[0]]: new window.ort.Tensor("float32", new Float32Array(3 * S * S), [1, 3, S, S]) });
        return s;
      };
      if (gpu) {
        try {
          const s = await window.ort.InferenceSession.create(bytes, { executionProviders: ["webgpu"] });
          s.backend = "WebGPU";
          return await warm(s);
        } catch { /* fall back to WebAssembly */ }
      }
      const s = await window.ort.InferenceSession.create(bytes, { executionProviders: ["wasm"] });
      s.backend = "WASM";
      return await warm(s);
    })().catch((e) => { sessionPromise = null; throw e; });
  }
  return sessionPromise;
}

function iou(a, b) {
  const x1 = Math.max(a[0], b[0]), y1 = Math.max(a[1], b[1]), x2 = Math.min(a[2], b[2]), y2 = Math.min(a[3], b[3]);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  return inter / ((a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - inter + 1e-9);
}

// Same post-processing as app/detector.py in sawit-vision-api: best class score, threshold, NMS.
function decode(candidates, conf, agnostic) {
  const kept = [];
  for (const c of candidates.filter((c) => c.score >= conf).sort((a, b) => b.score - a.score)) {
    if (kept.every((k) => (!agnostic && k.cls !== c.cls) || iou(k.box, c.box) <= 0.45)) kept.push(c);
  }
  return kept.map((k) => ({ ...k, label: agnostic ? "Bunch" : NAMES[k.cls] }));
}

async function infer(img, onProgress) {
  const session = await getSession(onProgress);
  const w0 = img.naturalWidth, h0 = img.naturalHeight, r = Math.min(S / w0, S / h0);
  const nw = Math.round(w0 * r), nh = Math.round(h0 * r), px = Math.floor((S - nw) / 2), py = Math.floor((S - nh) / 2);
  const cv = document.createElement("canvas"); cv.width = S; cv.height = S;
  const g = cv.getContext("2d"); g.fillStyle = "rgb(114,114,114)"; g.fillRect(0, 0, S, S); g.drawImage(img, px, py, nw, nh);
  const px4 = g.getImageData(0, 0, S, S).data, area = S * S, x = new Float32Array(3 * area);
  for (let i = 0; i < area; i++) { x[i] = px4[i * 4] / 255; x[i + area] = px4[i * 4 + 1] / 255; x[i + 2 * area] = px4[i * 4 + 2] / 255; }
  const t0 = performance.now();
  const out = await session.run({ [session.inputNames[0]]: new window.ort.Tensor("float32", x, [1, 3, S, S]) });
  const ms = performance.now() - t0;
  const o = out[session.outputNames[0]].data, n = 8400, nc = NAMES.length, cands = [];
  for (let j = 0; j < n; j++) {
    let best = 0, cls = 0;
    for (let c = 0; c < nc; c++) { const s = o[(4 + c) * n + j]; if (s > best) { best = s; cls = c; } }
    if (best < 0.1) continue;
    const cx = o[j], cy = o[n + j], bw = o[2 * n + j], bh = o[3 * n + j];
    const box = [(cx - bw / 2 - px) / r, (cy - bh / 2 - py) / r, (cx + bw / 2 - px) / r, (cy + bh / 2 - py) / r]
      .map((v, k) => Math.max(0, Math.min(k % 2 ? h0 : w0, v)));
    cands.push({ score: best, cls, box });
  }
  return { cands, ms, w: w0, h: h0, backend: session.backend, live: true };
}

export default function LiveDemo() {
  const [cache, setCache] = useState(null);       // precomputed candidates per sample
  const [live, setLive] = useState(false);        // visitor opted in to running the model
  const [status, setStatus] = useState("idle");   // idle | loading | running | error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [sample, setSample] = useState(SAMPLES[0].key); // sample key, or null for an upload
  const [imgSrc, setImgSrc] = useState(SAMPLES[0].src);
  const [liveResult, setLiveResult] = useState(null);
  const [conf, setConf] = useState(0.25);
  const [agnostic, setAgnostic] = useState(false);
  const [drag, setDrag] = useState(false);
  const imgRef = useRef(null);
  const fileRef = useRef(null);
  const liveRef = useRef(false);

  useEffect(() => {
    fetch(`${BASE}/samples/detections.json`).then((r) => r.json()).then(setCache).catch(() => {});
  }, []);

  const run = useCallback(async () => {
    const img = imgRef.current;
    if (!img || !img.complete || !img.naturalWidth) return;
    setError(""); setStatus(sessionPromise ? "running" : "loading");
    try {
      const r = await infer(img, setProgress);
      setLiveResult(r); setStatus("idle");
    } catch (e) { setError(e.message || String(e)); setStatus("error"); }
  }, []);

  const goLive = () => { liveRef.current = true; setLive(true); run(); };
  const pick = (s) => { setLiveResult(null); setSample(s.key); setImgSrc(s.src); };
  const onFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    liveRef.current = true; setLive(true);
    setLiveResult(null); setSample(null); setImgSrc(URL.createObjectURL(f));
  };

  const pre = sample && cache ? cache[sample] : null;
  const result = liveResult || (pre ? { ...pre, live: false } : null);
  const dets = result ? decode(result.cands, conf, agnostic) : [];
  const graded = result ? (agnostic ? decode(result.cands, conf, false) : dets) : [];
  const counts = NAMES.map((k) => graded.filter((d) => d.label === k).length);
  const maxCount = Math.max(1, ...counts);
  const busy = status === "loading" || status === "running";

  return (
    <div className="bench">
      <div
        className={`stage${drag ? " drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
      >
        <img ref={imgRef} src={imgSrc} alt="Oil palm tree photographed from the ground" crossOrigin="anonymous"
          onLoad={() => liveRef.current && run()} />
        {result && (
          <svg viewBox={`0 0 ${result.w} ${result.h}`} preserveAspectRatio="xMidYMid meet" className="boxes" key={imgSrc + conf + agnostic + result.live}>
            {dets.map((d, i) => {
              const [x1, y1, x2, y2] = d.box, col = VARS[d.label];
              const fs = Math.max(13, result.w / 42), sw = Math.max(3, result.w / 260);
              const ty = y1 - fs * 1.45 < 0 ? y1 : y1 - fs * 1.45;
              return (
                <g key={i} style={{ animationDelay: `${i * 0.06}s` }} className="det">
                  <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill="none" stroke="rgb(0 0 0 / 0.55)" strokeWidth={sw * 2.4} rx="3" />
                  <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill="none" stroke={col} strokeWidth={sw} rx="3" />
                  <rect x={x1} y={ty} width={fs * (d.label.length * 0.62 + 2.9)} height={fs * 1.45} fill={col} rx="2" />
                  <text x={x1 + fs * 0.35} y={ty + fs * 1.08} fontSize={fs} fill="#111" fontWeight="600" fontFamily="IBM Plex Mono, monospace">
                    {d.label} {d.score.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
        {!live && (
          <button className="btn run" type="button" onClick={goLive}>Run it live (9.8 MB, once)</button>
        )}
        {status === "loading" && (
          <div className="veil">{progress < 1 ? `Downloading model… ${Math.round(progress * 100)}%` : "Starting the model…"}<i style={{ width: `${progress * 100}%` }} /></div>
        )}
        {status === "running" && <div className="veil">Detecting…</div>}
        {drag && <div className="veil">Drop the photo to run it</div>}
      </div>

      <div className="panel">
        <div className="readout" aria-live="polite">
          <div><b>{result ? dets.length : "–"}</b><span>{agnostic ? "bunches" : "graded bunches"}</span></div>
          <div><b>{result?.live ? Math.round(result.ms) : "–"}</b><span>ms per photo</span></div>
          <div><b className="small-b">{result?.live ? result.backend : "Cached"}</b><span>{result?.live ? "on your device" : "until you run it"}</span></div>
        </div>

        <div className={`dist${agnostic ? " dim" : ""}`}>
          <div className="label">Per grade</div>
          {NAMES.map((k, i) => (
            <div className="bar-row" key={k}>
              <span>{k}</span>
              <span className="track"><span className="fill" style={{ width: `${(counts[i] / maxCount) * 100}%`, background: VARS[k] }} /></span>
              <span>{result ? counts[i] : "–"}</span>
            </div>
          ))}
        </div>

        <div className="seg" role="group" aria-label="Output">
          <button type="button" aria-pressed={!agnostic} onClick={() => setAgnostic(false)}>Grade B1–B4</button>
          <button type="button" aria-pressed={agnostic} onClick={() => setAgnostic(true)}>Bunches only</button>
        </div>
        <label className="slider">
          <span>Confidence ≥ {conf.toFixed(2)}</span>
          <input type="range" min="0.1" max="0.9" step="0.05" value={conf} onChange={(e) => setConf(Number(e.target.value))} />
        </label>

        <div>
          <div className="label">Sample trees</div>
          <div className="trees">
            {SAMPLES.map((s, i) => (
              <button key={s.key} type="button" aria-pressed={sample === s.key} onClick={() => pick(s)} aria-label={`Sample tree ${i + 1}`} disabled={busy}>
                <img src={s.thumb} alt="" />
              </button>
            ))}
            <button type="button" className="up" aria-pressed={sample === null} onClick={() => fileRef.current.click()} disabled={busy}>Your photo</button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files[0])} />
          </div>
        </div>

        {error && <p className="err">{error}</p>}
        <div className="limits">
          <strong>Where it fails.</strong> Small bunches high in the crown get missed in photos taken from far away, and neighbouring
          grades get mixed up: a red, ripe bunch sometimes comes out B2.
        </div>
        <p className="fine">
          Boxes for the sample trees are computed ahead with the same model, so nothing downloads until you press Run. Live runs use
          WebGPU where available, WebAssembly otherwise; uploaded photos are not sent anywhere. Same model and post-processing as
          the <a href="https://github.com/muhammad-zainal-muttaqin/sawit-vision-api" target="_blank" rel="noreferrer">Sawit Vision API</a>.
        </p>
      </div>
    </div>
  );
}
