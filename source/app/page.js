import { profile, skills, experience, publications } from "../data/profile";
import { featured, more } from "../data/projects";
import { Featured, More } from "./projects";
import LiveDemo from "./live-demo";

export default function Home() {
  return (
    <main className="page">
      <header>
        <h1>{profile.name}</h1>
        {profile.intro.map((t) => <p key={t}>{t}</p>)}
        <p className="links-inline">
          {profile.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}
        </p>
      </header>

      <section id="demo" className="wide">
        <h2>Fruit bunch detector</h2>
        <p>
          This is the YOLO26n detector our lab ships in the PalmAnnotate field app, trained on the SawitMVC dataset (953 trees, 3,992 photos),
          running in your browser with ONNX Runtime Web. The photos are from a field capture in November 2026 that it was not trained on.
          It grades each bunch from B1 (ripe) to B4 (unripe).
        </p>
        <LiveDemo />
      </section>

      <section>
        <h2>Selected work</h2>
        <Featured items={featured} />
      </section>

      <section>
        <h2>Smaller projects</h2>
        <More items={more} />
      </section>

      <section>
        <h2>Publications</h2>
        <ol className="pubs">
          {publications.map((p) => (
            <li key={p.title}>{p.authors} “{p.title}.” <em>{p.venue}</em>.</li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Experience and education</h2>
        <table className="cv">
          <tbody>
            {experience.map((e) => (
              <tr key={e.title}>
                <td className="meta">{e.when}</td>
                <td><strong>{e.title}</strong>, {e.org}. {e.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Tools I use</h2>
        <table className="cv">
          <tbody>
            {skills.map((s) => (
              <tr key={s.group}><td className="meta">{s.group}</td><td>{s.items}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer>
        <p>The quickest way to reach me is a message on <a href={profile.links[1].href} target="_blank" rel="noreferrer">LinkedIn</a>.
          Source for this site is on <a href="https://github.com/muhammad-zainal-muttaqin/muhammad-zainal-muttaqin.github.io" target="_blank" rel="noreferrer">GitHub</a>.</p>
      </footer>
    </main>
  );
}
