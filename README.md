# Portfolio website

A static portfolio site: plain HTML, CSS and JavaScript. No build step, no dependencies. It runs on GitHub Pages as it is.

## What is in this folder

```
portfolio-site/
├── index.html          The page. All your text lives here.
├── 404.html            Shown by GitHub Pages for unknown addresses.
├── css/style.css       All styling, including the light and dark themes.
├── js/main.js          Theme toggle, mobile menu, current-section highlight.
├── assets/favicon.svg  The browser tab icon (initials "SG").
├── robots.txt          Lets search engines index the site.
├── .nojekyll           Tells GitHub Pages to serve the files exactly as they are.
└── README.md           This guide. You can delete it before publishing if you like.
```

## 1. Review and personalize

The content comes from your LinkedIn profile PDF: experience, projects, education, certifications and contact details. Read through `index.html` once and change anything that does not sound like you.

Worth checking:

1. **Hero headline and `profile.yaml` panel**: the values in the panel are written as a manifest. If you add or remove a line, update `--n` on the `<figure class="manifest">` tag, number the lines `--i:0`, `--i:1` and so on, and update the text "12 of 12 lines".
2. **About**: two short paragraphs. Edit them in your own voice.
3. **Experience**: your last role is listed as ending in September 2026, as on your profile. When you start a new job, add an entry at the top with `<li class="job job--current">` (the filled blue dot) and write "to Present" in its dates.
4. **Projects**: the three projects come from your most recent role. They have no GitHub links because that work is not public. If you publish code later, add a link inside `.ledger__body` (an example is in an HTML comment there).
5. **Contact**: your email address is on the page in plain text. Public addresses attract spam. A contact form (see "Ideas for part two") avoids that.
6. **GitHub link**: add one next to LinkedIn once you have a profile you want to show (a comment in the Contact section shows how).
7. **Colors**: change `--accent` at the top of `css/style.css` to restyle the whole site. There is a light value in `:root` and a dark value under `[data-theme="dark"]`.

Your secondary school record (from the last page of your profile) is not on the site. Add a row to the Education list if you want it.

Find the remaining instruction comments:

```bash
grep -n "EDIT" index.html
```

These are notes in HTML comments (domain lines and the manifest), not visible text.

## 2. Preview on your computer

You need Python 3 (already installed on most systems). From inside the folder:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Press `Ctrl+C` in the terminal to stop it. Reload the browser after each edit.

Alternative: in VS Code, install the "Live Server" extension, right-click `index.html` and choose "Open with Live Server".

## 3. Publish on GitHub Pages

### Step 1. Create the repository

1. Use your existing public repository: `Sidusanka/portfolio`.

### Step 2. Upload the files

**Option A: in the browser (no tools needed)**

1. On the empty repository page, click **uploading an existing file**.
2. Open the `portfolio-site` folder on your computer and select everything inside it (not the folder itself). Drag it all into the browser. Folders such as `css`, `js` and `assets` upload with their contents.
3. Confirm that `index.html` is at the top level of the repository, not inside a subfolder.
4. Click **Commit changes**.

**Option B: with Git (recommended, since you will update the site often)**

Run these inside the `portfolio-site` folder:

```bash
git init -b main
git add .
git commit -m "Add portfolio site"
git remote add origin git@github.com:Sidusanka/portfolio.git
git push -u origin main
```

When Git asks for a password, use a personal access token or sign in through GitHub CLI (`gh auth login`). GitHub no longer accepts account passwords for pushes.

### Step 3. Turn on GitHub Pages

1. In the repository, open **Settings**, then **Pages** in the left menu.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Set **Branch** to `main` and the folder to `/ (root)`, then click **Save**.
4. Wait one to two minutes. Open the **Actions** tab to watch the "pages build and deployment" run. When it shows a green tick, visit `https://sidusanka.github.io/portfolio/`.

### Step 4. Update the site later

Edit a file, then:

```bash
git add .
git commit -m "Update projects"
git push
```

Changes go live in about a minute.

## 4. Use your Namecheap domain (when you buy it)

Do these in order. Adding the domain in GitHub first protects you from someone else claiming it.

### In GitHub

1. Open the repository, then **Settings**, then **Pages**.
2. Under **Custom domain**, type your domain, for example `your-domain.com`, and click **Save**. GitHub adds a file named `CNAME` to the repository. If you use Git, run `git pull` afterwards so you do not overwrite it.
3. Recommended: verify the domain. Open your profile **Settings**, then **Pages**, click **Add a domain** and follow the TXT record steps. This stops others from using your domain on their GitHub sites.

### In Namecheap

1. Go to **Domain List**, click **Manage** next to your domain, then open the **Advanced DNS** tab.
2. Delete the default records Namecheap created: the `CNAME` for `www` pointing to `parkingpage.namecheap.com` and the `URL Redirect` record for `@`.
3. Add these records:

| Type | Host | Value |
|------|------|-------|
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `YOUR-DOMAIN.com.` |

Optional IPv6 (add as `AAAA Record`, host `@`): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

The `www` target is your username only, without the repository name. Do not use a wildcard record (`*`).

4. Save. DNS changes usually work within minutes and can take up to 24 hours.

### Back in GitHub

1. In **Settings**, then **Pages**, wait for the "DNS check successful" message.
2. Tick **Enforce HTTPS**. If the box is greyed out, wait a few minutes and reload. GitHub is still issuing the certificate.
3. In `index.html`, uncomment the `canonical` and `og:url` lines near the top and put in your domain. Commit and push.

You can use either `your-domain.com` or `www.your-domain.com` as the main address. GitHub redirects the other one to it.

## 5. Optional: deploy with GitHub Actions instead

The branch method above is simpler. If you prefer a pipeline, set **Settings**, **Pages**, **Source** to **GitHub Actions**, then add `.github/workflows/pages.yml`:

```yaml
name: Deploy site

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

Check the current major versions of these actions on their GitHub pages before you rely on them.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Page shows 404 | Confirm `index.html` is at the top level of the repository and Pages is set to `main` and `/ (root)`. |
| Page has no styling | File names are case sensitive on GitHub. Keep `css/style.css` and `js/main.js` in lower case. |
| Site works at `username.github.io` but not your domain | DNS has not propagated yet, or old Namecheap records are still there. Re-check the Advanced DNS tab. |
| "Enforce HTTPS" is greyed out | Wait up to an hour after the DNS check passes, then reload the Pages settings. |
| Custom domain disappears after a push | The `CNAME` file was overwritten. Run `git pull`, or add a file named `CNAME` containing only your domain. |
| Your edits do not appear | Hard refresh with `Ctrl+Shift+R` (`Cmd+Shift+R` on Mac), and check the Actions tab for a failed build. |

## Ideas for part two

- Case-study pages for your best projects.
- An Open Graph image (1200 by 630 pixels, saved as `assets/og-image.png`) so links look good when shared.
- A contact form through a service such as Formspree, since GitHub Pages cannot run server code.
- Privacy-friendly analytics such as Plausible or GoatCounter.
- A Lighthouse check in Chrome DevTools before you share the link.
