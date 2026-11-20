"use client";
import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function Links({ links }) {
  return (
    <p className="plinks">
      {links.map((l) => (
        <a key={l.href} href={l.href} {...(l.href.startsWith("#") ? {} : { target: "_blank", rel: "noreferrer" })} className={l.label.startsWith("Live") ? "live" : ""}>
          {l.label.startsWith("Live") && <i className="dot" />}{l.label} {l.href.startsWith("#") ? "↑" : "↗"}
        </a>
      ))}
    </p>
  );
}

function Media({ p }) {
  if (p.thumb) return <div className="media"><img src={`${BASE}/thumbs/${p.thumb}`} alt="" loading="lazy" /></div>;
  if (p.art) return <div className="media art"><span>{p.art}</span></div>;
  return null;
}

export default function Projects({ featured, more, categories }) {
  const [cat, setCat] = useState("all");
  const show = (p) => cat === "all" || p.cats.includes(cat);
  const f = featured.filter(show);
  const m = more.filter(show);
  const role = categories.find((c) => c.id === cat);
  return (
    <>
      <p className="hiring">Hiring for…</p>
      <div className="filters" role="tablist">
        {categories.map((c) => (
          <button key={c.id} role="tab" aria-selected={cat === c.id} className={cat === c.id ? "on" : ""} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <p className="pitch" key={cat}>{role.pitch} <span className="muted">({f.length + m.length} matching projects)</span></p>
      <div className="grid">
        {f.map((p, i) => (
          <article key={p.title} className="card project" style={{ animationDelay: `${i * 0.05}s` }}>
            <Media p={p} />
            <div className="body">
              <p className="ctx">{p.context}</p>
              <h3>{p.title}</h3>
              <ul className="results">{p.results.map((r) => <li key={r}>{r}</li>)}</ul>
              <details>
                <summary>Problem & what I built</summary>
                <p><span className="k">Problem</span> {p.problem}</p>
                <p><span className="k">What I built</span> {p.built}</p>
              </details>
              <ul className="tags">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
              <Links links={p.links} />
            </div>
          </article>
        ))}
      </div>
      {m.length > 0 && (
        <>
          <h3 className="sub">More projects</h3>
          <div className="grid small">
            {m.map((p) => (
              <article key={p.title} className="card">
                <h4>{p.title}</h4>
                <p className="muted">{p.text}</p>
                <Links links={p.links} />
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
