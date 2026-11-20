"use client";
import { useEffect, useRef, useState } from "react";

// Animates the leading number of a value like "23 ms" or "0.77" once it scrolls into view.
export default function CountUp({ value }) {
  const m = String(value).match(/^([\d.]+)(.*)$/);
  const [shown, setShown] = useState(m ? "0" + m[2] : value);
  const ref = useRef(null);
  useEffect(() => {
    if (!m) return;
    const target = parseFloat(m[1]), dec = (m[1].split(".")[1] || "").length;
    let raf, start;
    const ob = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ob.disconnect();
      const step = (t) => {
        start ??= t;
        const p = Math.min(1, (t - start) / 1100), ease = 1 - Math.pow(1 - p, 3);
        setShown((target * ease).toFixed(dec) + m[2]);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    ob.observe(ref.current);
    return () => { ob.disconnect(); cancelAnimationFrame(raf); };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{shown}</span>;
}
