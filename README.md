# Aniyah Williams — Illustration Portfolio

> **Download tip:** grab the full `portfolio.zip` (not the individual file previews) and unzip it — that keeps `assets/` sitting right next to the HTML files, which is what makes the images actually show up.

A clean, static, three-page portfolio site — Home, Gallery, and Resume — styled with your color palette (Deep Navy, Slate Gray, Soft Sage, Warm Sand, Coral Blush, Dusty Terracotta).

## Pages
- `index.html` — Home: hero, a work preview, About, a quick-contact section
- `gallery.html` — Gallery: Digital Illustration, Branding & Logo Design, Web Design, and Photography, with a click-to-enlarge lightbox on every piece
- `resume.html` — Resume: filled in with your info from the PDF (a few typos cleaned up: "graduate," "Graduated," "Affinity Designer," "Collaborative," "distribution," "programming")
- `contact.html` — Contact: a form that emails submissions straight to you (see "Contact form" below)
- `terms.html` — Terms & Conditions: states that images on the site may not be scraped, downloaded, or used to train AI models, linked from every page's footer

## Fonts
The site uses three self-hosted fonts (no Google Fonts anymore):
- **Garvistest (regular)** — body copy
- **Garvistest (italic)** — smaller accent text (eyebrows, tags, labels, captions)
- **Hukela Wild Display** — display headings (logo, hero text, section titles)

The font files live in `assets/fonts/` and are loaded via `@font-face` at the top of `style.css`. If you ever want to swap a typeface, replace the file in `assets/fonts/` and update the matching `src` path in the `@font-face` rule.

## Blocking AI scraping (robots.txt)
Alongside the Terms & Conditions page, `robots.txt` at the site root asks well-known AI crawlers (GPTBot, CCBot, ClaudeBot, Bytespider, and others) not to crawl the site. This is advisory — it only stops crawlers that choose to respect it — so the Terms page is the actual policy statement; `robots.txt` just reinforces it technically.

## Contact form (important — one-time setup)
The form on `contact.html` uses [FormSubmit](https://formsubmit.co) — a free service that forwards form submissions to your email with **no backend code needed**, which is exactly what a static GitHub Pages site requires.

**The first time someone submits the form**, FormSubmit will send a confirmation email to `Aniyah.6424@gmail.com`. Click the activation link in that email once — after that, every future submission is delivered straight to your inbox automatically, no further action needed.

If you'd rather use a different email, change the address in the form's `action` attribute in `contact.html`:
```html
<form class="contact-form" action="https://formsubmit.co/YOUR-EMAIL-HERE" method="POST">
```

## Files
- `style.css` — all styling, shared across pages
- `script.js` — mobile menu, footer year, and the gallery lightbox, shared across pages
- `assets/` — your artwork images and resume PDF live here

## Loading animations
Clicking **Gallery** or **Contact** in the nav bar plays a full-screen animated icon (`assets/camera-snap.svg` and `assets/contacts-page.svg`) before the new page loads. Both SVGs are self-contained animated graphics — swap the file in `assets/` and update the matching `iconSrc` in the `setUpSnapLoader(...)` calls near the top of `script.js` to change them.

## Adding more artwork to the gallery

**Naming convention:** when you export or upload a new piece, name the file (or just keep in mind) with the pattern `Piece Title — Section Name`, e.g. `Summer Sketch — Digital Illustration` or `Coffee Shop Logo — Branding & Logo Design`. That `— Section Name` part tells you (or me, in a future chat) which section of the gallery it belongs in:
- `— Branding & Logo Design` → the `#branding` section
- `— Digital Illustration` → the `#illustration` section
- `— Web Design` → the `#web-design` section
- `— Photography` → the `#photography` section

**That suffix is only a sorting label — it should NOT appear in the title shown on the site.** The site strips it off: only `Piece Title` is used in the caption, lightbox, and alt text, since which section a piece is in is already obvious from the page section it's sitting in.

Each piece in `gallery.html` is one `<figure>` block:
```html
<figure class="card pin-a">
  <button class="card-trigger" data-full="assets/your-image.jpg" data-title="Piece Title">
    <img src="assets/your-image.jpg" alt="Piece Title" loading="lazy">
  </button>
  <figcaption><span class="tag">Category</span>Piece Title</figcaption>
</figure>
```
- `src` / `data-full` — path to the image in `assets/`
- `data-title` — the **trimmed** title (no "— Section Name") that shows under the enlarged image in the lightbox and in the figcaption
- `.tag` — a short category label shown above the title (e.g. "Illustration", "Logo", "Web Design")
- The `pin-a` / `pin-b` / `pin-c` classes just rotate the card slightly — cycle through them for variety

To add a new section, copy an existing `<section class="gallery-section">` block, give it a new `id`, and add matching `<img>` thumbnails to `index.html`'s preview or the nav if you want a direct link to it.

**Note on image size:** the uploaded images were resized (max 1800px) and compressed to keep the site fast — the originals in `assets/` are already web-optimized.

## 2. Add your resume PDF
`resume.html` has a "Download PDF" button pointing to `assets/Aniyah-Williams-Resume.pdf`. Add your resume PDF into the `assets/` folder with that filename (or update the `href` in `resume.html` to match your file name).

## 3. Preview it locally
Just double-click `index.html` to open it in your browser — no build step required. Or, for a local server:
```
python3 -m http.server 8000
```
then visit `http://localhost:8000`.

## 4. Put it on GitHub with GitHub Pages (one command)
Install [git](https://git-scm.com) and the [GitHub CLI](https://cli.github.com), unzip the site, open a terminal in the folder, and run:
```bash
./publish-to-github.sh
```
It creates a public repo called `<your-username>.github.io`, pushes the site, and switches GitHub Pages on — your site is then live at `https://<your-username>.github.io/` within a couple of minutes. (Naming the repo `<your-username>.github.io` puts the site at the root URL, which is also what lets `robots.txt` work.) To use a different repo name: `./publish-to-github.sh my-portfolio`.

**Doing it by hand instead:** create an empty public repo on GitHub, then
```bash
git init -b main && git add -A && git commit -m "Initial portfolio site"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```
and in the repo go to **Settings → Pages → Deploy from a branch → `main` / `(root)`**.

## Customizing further
- Colors live as CSS variables at the top of `style.css` under `:root` — change any hex value there to update it site-wide.
- Fonts (Fraunces, Inter, Space Mono) are loaded from Google Fonts in `index.html`.
