"use client";
import { useCallback, useRef, useState } from "react";

const ORT_VER = "1.20.1";
const ORT_CDN = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VER}/dist/`;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const MODEL_URL = `${BASE}/models/sawit-yolov8n.onnx`;
const NAMES = ["Abnormal", "Flower", "Ripe", "Underripe", "Unripe"];
const COLORS = { Ripe: "#e8590c", Underripe: "#f59f00", Unripe: "#37b24d", Flower: "#ae3ec9", Abnormal: "#868e96", Bunch: "#e8590c" };
const SAMPLES = [1, 2, 3, 4, 5].map((i) => ({ src: `${BASE}/samples/palm-${i}.jpg`, thumb: `${BASE}/samples/palm-${i}-thumb.jpg` }));
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
  const total = Number(res.headers.get("content-length")) || 12_268_875;
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
      // One warm-up run so the first timing shown to the visitor excludes shader/kernel compilation.
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
      s.backend = "WebAssembly";
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
  return { cands, ms, w: w0, h: h0, backend: session.backend };
}

export default function LiveDemo() {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [imgSrc, setImgSrc] = useState(SAMPLES[0].src);
  const [result, setResult] = useState(null);
  const [conf, setConf] = useState(0.3);
  const [agnostic, setAgnostic] = useState(false);
  const [drag, setDrag] = useState(false);
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  const run = useCallback(async () => {
    const img = imgRef.current;
    if (!img || !img.complete || !img.naturalWidth) return;
    setError(""); setStatus(sessionPromise ? "running" : "loading");
    try {
      const r = await infer(img, setProgress);
      setResult(r); setStatus("done");
    } catch (e) { setError(e.message || String(e)); setStatus("error"); }
  }, []);

  const pick = (src) => { setResult(null); setImgSrc(src); if (status === "idle") setStatus("loading"); };
  const onFile = (f) => { if (f && f.type.startsWith("image/")) pick(URL.createObjectURL(f)); };

  const dets = result ? decode(result.cands, conf, agnostic) : [];
  const counts = dets.reduce((m, d) => ((m[d.label] = (m[d.label] || 0) + 1), m), {});

  return (
    <div className="demo">
      <div
        className={`stage${drag ? " drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
      >
        <img ref={imgRef} src={imgSrc} alt="Oil palm tree" crossOrigin="anonymous" onLoad={() => status !== "idle" && run()} />
        {result && (
          <svg viewBox={`0 0 ${result.w} ${result.h}`} preserveAspectRatio="xMidYMid meet" className="boxes" key={imgSrc + conf + agnostic}>
            {dets.map((d, i) => {
              const [x1, y1, x2, y2] = d.box, col = COLORS[d.label];
              const fs = Math.max(14, result.w / 32);
              return (
                <g key={i} style={{ animationDelay: `${i * 0.15}s` }} className="det">
                  <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={col} fillOpacity="0.12" stroke={col} strokeWidth={Math.max(3, result.w / 220)} rx="4" pathLength="100" />
                  <rect x={x1} y={Math.max(0, y1 - fs * 1.4)} width={fs * (d.label.length * 0.62 + 2.6)} height={fs * 1.4} fill={col} rx="3" />
                  <text x={x1 + fs * 0.3} y={Math.max(0, y1 - fs * 1.4) + fs * 1.05} fontSize={fs} fill="#fff" fontWeight="600">{d.label} {d.score.toFixed(2)}</text>
                </g>
              );
            })}
          </svg>
        )}
        {status === "idle" && (
          <button className="cta-run" onClick={() => { setStatus("loading"); run(); }}>
            Run the model on this photo (12 MB download)
          </button>
        )}
        {status === "loading" && <div className="veil">{progress < 1 ? `Downloading model… ${Math.round(progress * 100)}%` : "Loading model…"}<i style={{ width: `${progress * 100}%` }} /></div>}
        {status === "running" && <div className="veil">Detecting…</div>}
        {drag && <div className="veil">Drop to run</div>}
      </div>

      <div className="panel">
        <div className="readout">
          <div><b>{result ? dets.length : "–"}</b><span>bunches detected</span></div>
          <div><b>{result ? `${Math.round(result.ms)} ms` : "–"}</b><span>inference time{result ? `, ${result.backend}` : ""}</span></div>
        </div>
        <div className="chips">
          {Object.entries(counts).map(([k, v]) => <span key={k} style={{ borderColor: COLORS[k], color: COLORS[k] }}>{k} × {v}</span>)}
        </div>
        <div className="controls">
          <div className="seg" role="group" aria-label="Mode">
            <button className={!agnostic ? "on" : ""} onClick={() => setAgnostic(false)}>Ripeness classes</button>
            <button className={agnostic ? "on" : ""} onClick={() => setAgnostic(true)}>Detection only</button>
          </div>
          <label className="slider">Confidence ≥ {conf.toFixed(2)}
            <input type="range" min="0.1" max="0.9" step="0.05" value={conf} onChange={(e) => setConf(Number(e.target.value))} />
          </label>
        </div>
        <p className="small">Other trees</p>
        <div className="thumbs">
          {SAMPLES.map((s) => (
            <button key={s.src} className={imgSrc === s.src ? "on" : ""} onClick={() => pick(s.src)} aria-label="Sample palm photo">
              <img src={s.thumb} alt="" />
            </button>
          ))}
          <button className="upload" onClick={() => fileRef.current.click()}>Upload</button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files[0])} />
        </div>
        {error && <p className="err">{error}</p>}
        <p className="muted small">
          Runs locally with WebGPU, or WebAssembly where WebGPU is not available. Uploaded photos are not sent anywhere.
          You can also drag a photo onto the image.
        </p>
      </div>
    </div>
  );
}
