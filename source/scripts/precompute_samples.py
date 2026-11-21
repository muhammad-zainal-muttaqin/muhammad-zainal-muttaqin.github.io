"""Write public/samples/detections.json: raw candidates (score >= 0.1) for each sample photo.

The page applies the confidence threshold and NMS itself (same as app/live-demo.js), so the
precomputed result matches a live run. Run with the sawit-vision-api venv:
    ../sawit-vision-api/.venv/bin/python scripts/precompute_samples.py
"""
import json
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
S = 640
sess = ort.InferenceSession(str(ROOT / "public/models/ffb-detector-yolo26n.onnx"), providers=["CPUExecutionProvider"])
name = sess.get_inputs()[0].name
out = {}
for i in range(1, 6):
    img = Image.open(ROOT / f"public/samples/palm-{i}.jpg").convert("RGB")
    w0, h0 = img.size
    r = min(S / w0, S / h0)
    nw, nh = round(w0 * r), round(h0 * r)
    px, py = (S - nw) // 2, (S - nh) // 2
    canvas = Image.new("RGB", (S, S), (114, 114, 114))
    canvas.paste(img.resize((nw, nh), Image.BILINEAR), (px, py))
    x = (np.asarray(canvas, dtype=np.float32) / 255).transpose(2, 0, 1)[None]
    o = sess.run(None, {name: x})[0][0]  # [4+nc, 8400]
    scores = o[4:]
    cls = scores.argmax(0)
    best = scores.max(0)
    cands = []
    for j in np.where(best >= 0.1)[0]:
        cx, cy, bw, bh = o[:4, j]
        box = [(cx - bw / 2 - px) / r, (cy - bh / 2 - py) / r, (cx + bw / 2 - px) / r, (cy + bh / 2 - py) / r]
        box = [float(np.clip(v, 0, h0 if k % 2 else w0)) for k, v in enumerate(box)]
        cands.append({"score": round(float(best[j]), 4), "cls": int(cls[j]), "box": [round(v, 1) for v in box]})
    out[f"palm-{i}"] = {"w": w0, "h": h0, "cands": cands}
    print(i, len(cands))
(ROOT / "public/samples/detections.json").write_text(json.dumps(out, separators=(",", ":")))
