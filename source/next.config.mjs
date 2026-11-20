/** Static export: `npm run build` writes plain HTML to ./out (works on GitHub Pages, Vercel, Netlify). */
const basePath = process.env.BASE_PATH || "";
export default {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
