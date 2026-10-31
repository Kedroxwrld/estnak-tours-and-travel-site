# Estnak Tours and Travel

A fast, fully responsive marketing website for a tours and travel company, built with **HTML5**, **Tailwind CSS v4** and **vanilla JavaScript** — no framework and no runtime dependencies.

Estnak Tours and Travel is a Kampala-based brand used to showcase curated safaris, beach escapes, city breaks and cultural journeys across Uganda, East Africa and beyond. The site ships with branded image placeholders so you can drop in your own photography.

## Pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Hero search, travel styles, recommended tours, assistance banner, packages, how it works |
| Destinations | `destinations.html` | Filterable destination grid by region |
| Tours & Packages | `tours.html` | 14-tour catalogue with search, filters and sorting; transport and Tour Starter sections |
| About Us | `about.html` | Story, values, timeline, team and community impact |
| Contact | `contact.html` | Validated enquiry form, contact details, socials, map and FAQ |

## Quick start

```bash
npm install          # install Tailwind CSS build tools
npm run build        # assemble pages + compile minified CSS
npm run serve        # optional local preview at http://localhost:3000
```

You can also open `index.html` directly in a browser. The compiled stylesheet is committed at `assets/css/styles.css`, so the site works without a build step.

## Deploying on GitHub Pages

The GitHub Actions workflow in `.github/workflows/pages.yml` builds the site and deploys it to GitHub Pages whenever changes are pushed to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The deployed site is available at `https://<owner>.github.io/<repository>/`.

### Useful scripts

| Command | What it does |
| --- | --- |
| `npm run build:html` | Injects the shared header/footer into `src/pages/*.html` and writes the finished pages to the project root |
| `npm run build:css` | Compiles and minifies `src/input.css` → `assets/css/styles.css` |
| `npm run build` | Runs both steps in the correct order (HTML first, so Tailwind can scan the output) |
| `npm run watch:css` | Rebuilds the stylesheet on change while developing |
| `npm run serve` | Serves the project locally with `npx serve` |

> Always run `npm run build` after editing a page or partial. Editing root HTML directly will be overwritten the next time the HTML build runs.

## Project structure

```text
.
├─ assets/
│  ├─ css/styles.css        compiled Tailwind output (committed)
│  ├─ img/                  image placeholders, logo files and favicon
│  └─ js/main.js            all site interactions
├─ partials/
│  ├─ header.html           shared header, desktop nav and mobile menu
│  └─ footer.html           shared footer, newsletter, socials and WhatsApp float
├─ scripts/
│  ├─ build-html.mjs        zero-dependency page assembler
│  └─ make-placeholders.ps1 regenerates the branded JPG placeholders
├─ src/
│  ├─ input.css             Tailwind theme, utilities and component styles
│  └─ pages/*.html          page sources with partial markers
├─ index.html               built pages
├─ destinations.html
├─ tours.html
├─ about.html
├─ contact.html
├─ robots.txt
└─ sitemap.xml
```

## Editing pages

Each file in `src/pages/` contains two markers:

```html
<!--@header tours-->
...
<!--@footer-->
```

`scripts/build-html.mjs` replaces them with the matching partials. The key after `@header` (`home`, `destinations`, `tours`, `about`, `contact`) also adds `aria-current="page"` to the corresponding navigation link.

To change the navigation, CTA or footer, edit `partials/header.html` or `partials/footer.html` once and rebuild.

## Brand and design system

The brand theme lives at the top of `src/input.css` using Tailwind v4's `@theme`:

- **Estnak blue** (`royal-50` → `royal-950`) — primary brand colour, headers and buttons. The core blue is `#254fe8` with a deep navy `#0b1b4d`.
- **Estnak green** (`jade-50` → `jade-900`) — highlights, badges, success states and accents. The core green is `#10b981`.
- **White / mist / slate** — clean backgrounds, borders and secondary text. The `slate-350/400/500` shades are intentionally darker than Tailwind's defaults so small muted text passes WCAG AA contrast on white and mist.
- **Fonts** — Poppins for display headings, Inter for body copy (Google Fonts with system fallbacks).

Reusable component classes include `.container-x`, `.btn-primary`, `.btn-green`, `.btn-outline`, `.field-input`, `.card`, `.eyebrow`, `.section`, `.link-arrow`, `.footer-link` and the reveal/carousel/filter utilities. Prefer these over one-off utilities so new sections stay consistent.

### Logo

The logo is an image, so you can replace it without touching the layout:

| File | Use |
| --- | --- |
| `assets/img/logo.svg` | Header and mobile menu (light backgrounds) |
| `assets/img/logo-light.svg` | Footer (dark background) |
| `assets/img/favicon.svg` | Browser tab icon |

Replace a file with your own SVG or transparent PNG of the same name. If you use a PNG, either keep the `.svg` filename (not recommended) or update the `src` paths in `partials/header.html`, `partials/footer.html` and the `<link rel="icon">` tags. The header logo is sized with `h-11`/`sm:h-12`; the footer uses `h-12`.

## Images

Every photo in `assets/img/` is a branded placeholder generated for this project. There are no third-party photos or attribution requirements in the template.

### Replace a placeholder in VS Code

1. Open `assets/img/` in the VS Code Explorer.
2. Find the file you want to replace (for example `hero-serengeti-balloon.jpg`).
3. Drop your own JPG or WebP over it, keeping the **same filename**.
4. Keep roughly the same aspect ratio. The recommended size is printed on each placeholder and listed in `assets/img/README.md`.

Because the filenames do not change, no HTML edits are needed. If you prefer different filenames, update the `src` attributes in `src/pages/*.html` and rebuild.

After replacing a photo, update its `alt` text in the page source so it describes the new image. The placeholder alt text describes the intended scene; accurate alt text helps screen-reader users and search engines.

### Image sizes

`assets/img/README.md` contains a table of every image slot, its recommended dimensions and where it is used. Most photos are 1280 px wide; export at up to 1600 px wide and keep each file under about 400 KB for fast loading.

### Regenerate the placeholders

```powershell
powershell -ExecutionPolicy Bypass -File scripts/make-placeholders.ps1
```

This overwrites the JPGs in `assets/img/` with fresh branded placeholders. It does not touch the logo files.

## Interactions

`assets/js/main.js` powers:

- Sticky header state, desktop dropdowns and accessible mobile menu
- Language selector (presentation only — no translations are bundled)
- Wishlist stored in `localStorage`
- Scroll-reveal animations and animated stat counters (respects `prefers-reduced-motion`)
- Hero destination combobox with keyboard support; submits to `tours.html?q=…`
- Latest packages carousel with previous/next controls
- Tour search, category/destination/duration/price filters, sorting and empty state
- Destination region filters and live result count
- Booking `<dialog>` injected once and shared by every `[data-book]` button
- Contact form validation, character counter and success state
- Newsletter validation and toast notifications
- Back-to-top button

## Connecting the forms

The booking and contact forms currently **simulate** a successful submission in the browser — nothing is sent to a server. To go live, pick one of these approaches:

1. **Form endpoint (simplest)** — create a form on Formspree, Basin, Netlify Forms or your host, then set the `<form>` `action`/`method` and remove the `preventDefault` simulation in `main.js`.
2. **Serverless function** — POST the `FormData` to an endpoint (Vercel/Netlify/Cloudflare function) that validates input and sends email via Resend, Postmark or SMTP.
3. **CRM/webhook** — forward the payload to HubSpot, Airtable or a WhatsApp Business API provider.

Keep the existing client-side validation as a first line of defence, and always validate again on the server. Never put API keys in `main.js`.

The booking success panel also offers a pre-filled WhatsApp handoff (`https://wa.me/256700123456`); update that number in `main.js`, `partials/header.html`, `partials/footer.html` and the contact page when the real line is available.

## Customising content

- **Tours** — each card in `src/pages/tours.html` carries `data-title`, `data-country`, `data-category`, `data-days`, `data-price`, `data-rating`, `data-keywords` and `data-order` attributes used by the filters. Keep these in sync with the visible copy and the `[data-book]` button's `data-tour`, `data-price` and `data-meta` values.
- **Destinations** — add a card with `data-destination-card` and a `data-region` value (`east-africa`, `north-africa`, `europe`, `asia`, `middle-east`) in `src/pages/destinations.html`.
- **Images** — replace files in `assets/img/` using the same names, or update `src` paths. Keep the `width`/`height` attributes in sync to prevent layout shift.
- **Brand details** — the phone `+256 700 123 456`, email `info@estnaktoursandtravel.com`, address Plot 12, Kampala Road, Kampala, and domain `https://www.estnaktoursandtravel.com/` are placeholders spread across the partials, page metadata and JSON-LD. Search and replace before launch.
- **Social links** — the template points to placeholder handles (`estnaktoursandtravel`) on Instagram, Facebook, X and YouTube. Replace them with your real profiles in the header, footer, contact page and home-page JSON-LD.

## SEO and accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`), one `<h1>` per page and ordered headings.
- Unique titles, descriptions, canonical URLs, Open Graph/Twitter cards and JSON-LD (`TravelAgency`, `AboutPage`, `ContactPage`, `BreadcrumbList`).
- `sitemap.xml` and `robots.txt` are included.
- Skip link, visible focus styles, labelled form fields, `aria-live` status messages, keyboard-operable menus, dialog and combobox.
- Motion is disabled under `prefers-reduced-motion: reduce`.
- Update the domain in canonical/OG tags, JSON-LD, `sitemap.xml` and `robots.txt` before deployment.

## Deployment

The output is plain static files. Upload the repository root (excluding `node_modules/` and `src/`) to Netlify, Vercel, Cloudflare Pages, GitHub Pages or any static host.

Typical build settings:

- **Build command:** `npm run build`
- **Output directory:** `.` (project root)
- **Node version:** 20 or newer

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). The site uses native `<dialog>`, CSS custom properties, `:has()`-free selectors and `localStorage`; JavaScript enhancements degrade gracefully where possible.

## Licence

Site code and copy © Estnak Tours and Travel. The included photos are generated placeholders and may be replaced with your own licensed imagery. This is a demonstration project — replace placeholder contact details, legal copy and imagery before commercial use.
