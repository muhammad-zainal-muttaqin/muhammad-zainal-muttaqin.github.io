import { profile, skills, experience, publications } from "../data/profile";
import { featured, more, categories } from "../data/projects";
import Projects from "./projects";
import LiveDemo from "./live-demo";
import HeroVisual from "./hero-visual";
import CountUp from "./count-up";

export default function Home() {
  return (
    <main>
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow"><i className="dot" /> Open to work · {profile.location}</p>
            <h1>I teach machines to <em>count palm fruit</em>, and ship them as apps you can try.</h1>
            <p className="lead">{profile.summary}</p>
            <nav className="links">
              <a href="#demo" className="primary">Try the live detector</a>
              <a href="#projects">See projects</a>
              {profile.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="ghost">{l.label}</a>
              ))}
            </nav>
          </div>
          <HeroVisual />
        </div>
        <dl className="wrap stats">
          {profile.stats.map((s) => (
            <div key={s.label}><dt><CountUp value={s.value} /></dt><dd>{s.label}</dd></div>
          ))}
        </dl>
      </header>

      <section id="demo" className="wrap">
        <p className="kicker">Live demo · runs in your browser</p>
        <h2>Point it at a palm tree</h2>
        <p className="muted narrow">The same model behind my research API, running right here. Pick a tree from our field data or drop in your own photo, then switch between ripeness classes and detection only.</p>
        <LiveDemo />
      </section>

      <section id="projects" className="wrap">
        <p className="kicker">Projects</p>
        <h2>Things I built, with numbers</h2>
        <p className="muted narrow">I wrote the code for every project here myself. “Research, ULM” marks work done for my research assistant role; “Collaboration project” is the one built with others.</p>
        <Projects featured={featured} more={more} categories={categories} />
      </section>

      <section className="wrap two-col">
        <div>
          <p className="kicker">Publications</p>
          <h2>Peer-reviewed work</h2>
          <ol className="pubs">
            {publications.map((p) => (
              <li key={p.title}><span className="venue">{p.venue} · {p.note}</span><strong>{p.title}</strong></li>
            ))}
          </ol>
          <a className="more-link" href={profile.links[2].href} target="_blank" rel="noreferrer">All papers on Google Scholar ↗</a>
        </div>
        <div>
          <p className="kicker">Experience</p>
          <h2>Where I have worked</h2>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.title}>
                <span className="when">{e.when}</span>
                <div><strong>{e.title}</strong><br /><span className="org">{e.org}</span><p className="muted">{e.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap">
        <p className="kicker">Skills</p>
        <h2>Toolbox</h2>
        <div className="skills">
          {skills.map((g) => (
            <div key={g.group} className="card">
              <h3>{g.group}</h3>
              <ul className="tags">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="cta-foot">
        <div className="wrap">
          <h2>Have a dataset nobody has made sense of yet?</h2>
          <p>I am looking for an AI engineer, computer vision, data or automation role, on-site, remote or abroad.</p>
          <nav className="links">
            <a className="primary" href={profile.links[1].href} target="_blank" rel="noreferrer">Message me on LinkedIn</a>
            <a href={profile.links[0].href} target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
