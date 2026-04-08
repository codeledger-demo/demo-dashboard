/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — the dashboard has zero server-side state in
  // demo/fixture mode, so we emit a plain static site that any host
  // can serve. Enables zero-cost deployment to GitHub Pages, Cloudflare
  // Pages, Netlify, S3, or any HTTP server.
  output: 'export',

  // Emit each route as <route>/index.html instead of <route>.html.
  // This matches GitHub Pages' default directory-based serving so
  // URLs like /team-health/ work without a trailing slash workaround.
  trailingSlash: true,

  // Dashboard is served from the root of the custom domain
  // (demo.codeledger.dev), so no basePath/assetPrefix needed.
  // NEXT_PUBLIC_BASE_PATH is still honored if ever deploying to
  // a sub-path (e.g. github.io fallback), but the default is root.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Disable image optimization (requires a server) — the demo does not
  // use next/image anyway.
  images: {
    unoptimized: true,
  },

  // Keep postgres external so it doesn't get bundled into the client.
  // In static export we never actually call it (fixture mode only).
  experimental: {
    serverComponentsExternalPackages: ['postgres'],
  },
};

export default nextConfig;
