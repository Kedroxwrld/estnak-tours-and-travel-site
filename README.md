# Estnak Tours and Travel

A responsive static website built with **Astro**, **TypeScript**, **Tailwind CSS v4** and vanilla browser interactions. Astro emits plain HTML, CSS and JavaScript for fast delivery on any static host.

## Requirements

- Node.js 22.23.4 or newer
- npm 9.6.5 or newer

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by Astro.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro development server |
| `npm run check` | Run Astro and TypeScript diagnostics |
| `npm run build` | Check the project and generate the production site in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run serve` | Alias for the production preview |

Generated files in `dist/` and Astro's `.astro/` cache are ignored by Git.

## Pages and URLs

Astro uses file-format output so the existing public URLs remain unchanged:

| Route source | Public URL |
| --- | --- |
| `src/pages/index.astro` | `/` |
| `src/pages/destinations.astro` | `/destinations.html` |
| `src/pages/tours.astro` | `/tours.html` |
| `src/pages/about.astro` | `/about.html` |
| `src/pages/contact.astro` | `/contact.html` |

## Project structure

```text
.
├─ public/
│  ├─ assets/img/             logos, favicons and optimized photography
│  ├─ robots.txt
│  └─ sitemap.xml
├─ src/
│  ├─ components/
│  │  ├─ SiteHeader.astro
│  │  └─ SiteFooter.astro
│  ├─ data/site.ts            typed business details and JSON-LD
│  ├─ layouts/BaseLayout.astro shared metadata, schema and document shell
│  ├─ pages/*.astro           the five static routes
│  ├─ scripts/main.ts         browser interactions
│  └─ styles/global.css       Tailwind theme and component styles
├─ astro.config.ts
├─ tsconfig.json
└─ package.json
```

Edit the `.astro` files rather than generated HTML. Shared navigation, footer, SEO tags and JSON-LD are defined once. Tailwind runs through the official `@tailwindcss/vite` plugin during the Astro build.

## Forms and conversion features

The contact form validates input and opens WhatsApp with the enquiry prefilled. Nothing is submitted to Estnak until the visitor reviews and sends the message in WhatsApp. The newsletter opens the visitor's email app with a subscription request; the static site does not store newsletter addresses.

The WhatsApp number, email, address, opening hours and social profiles are maintained in the shared components, page content and `src/data/site.ts`. Currency conversions use fixed indicative rates stored in `localStorage`; final quotes are confirmed by the business.

## Hostinger deployment

`.github/workflows/hostinger-deploy.yml` runs on pushes to `main` or manual dispatch. It installs dependencies with Node.js 24, runs `npm run build`, and uploads `dist/` over FTPS.

Configure these GitHub Actions secrets before the first deployment:

- `HOSTINGER_FTP_SERVER`
- `HOSTINGER_FTP_USERNAME`
- `HOSTINGER_FTP_PASSWORD`
- `HOSTINGER_SERVER_DIR`

Do not commit FTP credentials. Confirm that `HOSTINGER_SERVER_DIR` points to the correct Hostinger document root.

For another static host, use:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 22.23.4 or newer

## SEO and accessibility

The shared layout manages unique titles, descriptions, canonical URLs, Open Graph/Twitter cards and TravelAgency/TourOperator JSON-LD. Each page has one H1, semantic landmarks, descriptive image alt text, a skip link, keyboard-operable controls and reduced-motion support.
