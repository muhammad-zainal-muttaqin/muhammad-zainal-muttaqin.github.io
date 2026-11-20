# Portfolio website

Next.js 15 static site. All content lives in `data/profile.js` and `data/projects.js`; edit those, not the pages.

```bash
npm install
npm run dev        # http://localhost:3456
npm run build      # static HTML in ./out
```

Deploy: push to GitHub and import in Vercel (zero config), or for GitHub Pages build with
`BASE_PATH=/<repo-name> npm run build` and publish `out/`.
