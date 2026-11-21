import LiveDemo from "./live-demo";
import ThemeToggle from "./theme-toggle";
import { links, proof, cases, cards, software, publications, experience, tools, archive } from "../data/site";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function Ext({ href, className, children }) {
  const internal = href.startsWith("#");
  return internal
    ? <a className={className} href={href}>{children}</a>
    : <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

function Links({ items }) {
  return (
    <div className="links">
      {items.map((l) => <Ext key={l.href} href={l.href}>{l.label}</Ext>)}
    </div>
  );
}

function SecHead({ label, title, id, children }) {
  return (
    <div className="sec-head">
      <span className="label">{label}</span>
      <h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <header className="bar">
        <div className="wrap">
          <a className="mark" href="#top">M. Zainal Muttaqin</a>
          <nav aria-label="Sections">
            <a href="#demo">Demo</a>
            <a href="#work">Work</a>
            <a href="#papers">Papers</a>
            <a href="#about">About</a>
          </nav>
          <ThemeToggle />
          <a className="btn" href={`${BASE}/cv/Muhammad-Zainal-Muttaqin-CV.pdf`} target="_blank" rel="noreferrer">CV (PDF)</a>
        </div>
      </header>

      <main id="top">
        <div className="hero">
          <div className="wrap grid">
            <div className="text">
              <div className="eyebrow">
                <span className="label">Computer vision</span>
                <span className="label">Banjarbaru, Indonesia</span>
              </div>
              <h1>I teach computers to count oil palm fruit <em>from phone photos.</em></h1>
              <p className="lede">
                I’m Muhammad Zainal Muttaqin, a research assistant at Universitas Lambung Mangkurat. I collect and label field data, train
                and benchmark detectors, and turn the results into tools people use: an API, a model that runs in your browser, and the
                Android app our lab collects data with.
              </p>
              <span className="status"><i aria-hidden="true" />Open to AI/ML, data and software roles. Indonesia, remote or abroad.</span>
              <div className="ctas">
                <a className="btn" href="#demo">Try the detector</a>
                <Ext className="btn ghost" href={links.linkedin}>LinkedIn</Ext>
                <Ext className="btn ghost" href={links.github}>GitHub</Ext>
                <a className="btn ghost" href={`${BASE}/cv/Muhammad-Zainal-Muttaqin-CV.pdf`} target="_blank" rel="noreferrer">CV</a>
                <Ext className="btn ghost" href={links.scholar}>Scholar</Ext>
              </div>
              <div className="proof">
                {proof.map((p) => <div key={p.big}><b>{p.big}</b><span>{p.small}</span></div>)}
              </div>
            </div>
            <figure className="plate">
              <img src={`${BASE}/thumbs/multiview.jpg`} width="800" height="500"
                alt="Two side views of the same oil palm tree. Each fruit bunch has a numbered box; the same bunch has the same colour in both views." />
              <figcaption>
                One tree, four sides: <span className="num">13</span> unique bunches linked across views. Same colour means same bunch.
                Tree <span className="num">DAMIMAS_A21B_0140</span>.
              </figcaption>
              <div className="scale" role="img" aria-label="Ripeness grades from B1, ripe, to B4, unripe">
                <span className="s1">B1 <small>ripe</small></span><span className="s2">B2</span><span className="s3">B3</span><span className="s4">B4 <small>unripe</small></span>
              </div>
            </figure>
          </div>
        </div>

        <section id="demo" aria-labelledby="demo-h">
          <div className="wrap">
            <SecHead label="Live demo" title="Grade a palm tree in your browser." id="demo-h">
              A YOLO26n detector I trained on SawitMVC finds each fruit bunch and grades it from B1 (ripe) to B4 (unripe). The sample
              trees come from a November 2026 field capture the model never saw in training. Run it live and it works on your own photo
              too, on your device, so the photo never leaves it.
            </SecHead>
            <LiveDemo />
          </div>
        </section>

        <section id="work" aria-labelledby="work-h">
          <div className="wrap">
            <SecHead label="Selected work" title="From field photos to a count per tree." id="work-h">
              Three projects that make one pipeline: the counting research, the service that serves the model, and the app used to
              collect and label the data.
            </SecHead>

            {cases.map((c) => (
              <article className="case" key={c.title}>
                <div className="meta">
                  <span className="label tag">{c.tag}</span>
                  <span className="mono">{c.org}</span>
                  <span className="who">{c.who}</span>
                </div>
                <div className="body">
                  <h3>{c.title}</h3>
                  <dl>
                    <dt>Problem</dt><dd>{c.problem}</dd>
                    <dt>What I did</dt><dd>{c.did}</dd>
                    <dt>Result</dt><dd>{c.result}</dd>
                  </dl>
                  <div className="stack">{c.stack}</div>
                  <Links items={c.links} />
                </div>
                <figure>
                  {c.chart ? (
                    <div className="chart" role="img"
                      aria-label={`${c.chart.title}: ${c.chart.rows.map((r) => `${r.label} ${r.value}%`).join(", ")}`}>
                      <h4>{c.chart.title}</h4>
                      <div className="hbar">
                        {c.chart.rows.map((r) => (
                          <div className="row" key={r.label}>
                            <div className="lab">{r.label} <b>{r.value}%</b></div>
                            <div className="track"><div className={`fill${r.weak ? " weak" : ""}`} style={{ width: `${r.value}%` }} /></div>
                          </div>
                        ))}
                      </div>
                      <p className="note">{c.chart.note}</p>
                    </div>
                  ) : (
                    <>
                      <img src={`${BASE}${c.img.src}`} alt={c.img.alt} loading="lazy" width="800" height="500" />
                      <figcaption>{c.img.caption}</figcaption>
                    </>
                  )}
                </figure>
              </article>
            ))}

            <div className="cards">
              {cards.map((c) => (
                <article className="card" key={c.title}>
                  <span className="label">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <div className="fig num">{c.fig}</div>
                  <div className="figcap">{c.figcap}</div>
                  <Links items={c.links} />
                </article>
              ))}
            </div>

            <div className="sub-head">
              <span className="label">Software</span>
              <h2>Web apps and automation.</h2>
            </div>
            <ul className="soft">
              {software.map((s) => (
                <li key={s.title}>
                  <h4>{s.title}</h4>
                  <Links items={s.links} />
                  <p>{s.text}</p>
                  <span className="mono">{s.stack}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="papers" aria-labelledby="papers-h" className="tight">
          <div className="wrap">
            <SecHead label="Publications" title="Papers" id="papers-h" />
            <ol className="pubs">
              {publications.map((p) => (
                <li key={p.title}>
                  <span className="venue">{p.venue}</span>
                  <span className="cite">
                    {p.href ? <a className="t" href={p.href} target="_blank" rel="noreferrer">{p.title}</a> : <span className="t">{p.title}</span>}
                    <span className="a">{p.authors.map(([n, me], i) => (me ? <b key={i}>{n}</b> : <span key={i}>{n}</span>))}</span>
                    {p.first && <span className="role">1st author</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" aria-labelledby="about-h" className="tight">
          <div className="wrap">
            <SecHead label="About" title="Experience and tools" id="about-h" />
            <div className="about">
              <div className="cv">
                <ol>
                  {experience.map((e) => (
                    <li key={e.title}>
                      <span className="when">{e.when}</span>
                      <div><b>{e.title}</b> · {e.org}<p>{e.text}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="tools">
                <h3>What I use, and where</h3>
                <dl>
                  {tools.map((t) => (
                    <div key={t.group}>
                      <dt>{t.group}</dt>
                      <dd>{t.items}<small>{t.where}</small></dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <details className="archive">
              <summary>Everything else <span>{archive.length} smaller projects</span></summary>
              <table className="arch">
                <tbody>
                  {archive.map((a) => (
                    <tr key={a.title}>
                      <td>{a.year}</td>
                      <td><strong>{a.title}.</strong> {a.text}</td>
                      <td><span className="links"><Ext href={a.href}>{a.label}</Ext></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="wrap">
          <span className="label">Contact</span>
          <h2>Hiring for computer vision, ML or data work? I’d like to hear about it.</h2>
          <div className="ctas">
            <a className="btn" href={`mailto:${links.email}`}>Email me</a>
            <Ext className="btn ghost" href={links.linkedin}>LinkedIn</Ext>
            <a className="btn ghost" href={`${BASE}/cv/Muhammad-Zainal-Muttaqin-CV.pdf`} target="_blank" rel="noreferrer">Download CV</a>
            <Ext className="btn ghost" href={links.github}>GitHub</Ext>
          </div>
          <p className="reach">
            Or write to <a href={`mailto:${links.email}`}>{links.email}</a>. My phone number is on the CV.
          </p>
          <p className="fine">
            Site source on <Ext href={links.source}>GitHub</Ext>. Field photos from the Damimas block, shared with permission.
          </p>
        </div>
      </footer>
    </>
  );
}
