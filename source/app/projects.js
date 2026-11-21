const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function Links({ links }) {
  return (
    <span className="links-inline">
      {links.map((l) => (
        <a key={l.href} href={l.href} {...(l.href.startsWith("#") ? {} : { target: "_blank", rel: "noreferrer" })}>{l.label}</a>
      ))}
    </span>
  );
}

export function Featured({ items }) {
  return (
    <ol className="work">
      {items.map((p) => (
        <li key={p.title}>
          {p.thumb && <img src={`${BASE}/thumbs/${p.thumb}`} alt="" loading="lazy" />}
          <div>
            <h3>{p.title}</h3>
            <p className="meta">{p.year} · {p.context}</p>
            <p>{p.text}</p>
            <p className="meta">{p.stack}</p>
            <Links links={p.links} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function More({ items }) {
  return (
    <table className="more">
      <tbody>
        {items.map((p) => (
          <tr key={p.title}>
            <td className="meta">{p.year}</td>
            <td><strong>{p.title}</strong>. {p.text}</td>
            <td><Links links={p.links} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
