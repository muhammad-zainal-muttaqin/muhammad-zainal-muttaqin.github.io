"use client";
import hero from "../data/hero-detections.json";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const COLORS = { Ripe: "#e8590c", Underripe: "#f59f00", Unripe: "#37b24d", Flower: "#ae3ec9", Abnormal: "#868e96" };

export default function HeroVisual() {
  const fs = 26;
  return (
    <a className="hero-visual" href="#demo" aria-label="Open the live detector">
      <img src={`${BASE}/samples/palm-1.jpg`} alt="Oil palm tree with detected fruit bunches" />
      <svg viewBox={`0 0 ${hero.w} ${hero.h}`} preserveAspectRatio="xMidYMid slice">
        {hero.boxes.map((b, i) => {
          const [x1, y1, x2, y2] = b.box, col = COLORS[b.label];
          return (
            <g key={i} className="hbox" style={{ "--d": `${1.1 + i * 0.5}s` }}>
              <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx="6" fill={col} fillOpacity="0.14" stroke={col} strokeWidth="5" pathLength="100" />
              <rect x={x1} y={y1 - fs * 1.5} width={fs * (b.label.length * 0.62 + 2.8)} height={fs * 1.5} rx="4" fill={col} />
              <text x={x1 + 8} y={y1 - fs * 0.4} fontSize={fs} fill="#fff" fontWeight="700">{b.label} {b.conf.toFixed(2)}</text>
            </g>
          );
        })}
      </svg>
      <span className="scan" />
      <span className="badge"><i /> {hero.boxes.length} bunches found · YOLOv8n → ONNX</span>
      <span className="try">Try it on your own photo →</span>
    </a>
  );
}
