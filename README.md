# Luxe Eats — Multi-Restaurant Food Ordering Platform

A premium, luxury-glassmorphism food ordering website. Pure HTML/CSS/JS —
no build step, no npm install — with an **optional free Firebase backend**
that makes the Super Admin dashboard fully live (see below).

## Why the site looked black-and-white

That happens when the browser loads the page with **no CSS at all** —
which is exactly what plain, unstyled HTML looks like (black serif text,
white background, blue underlined links). It's not a code bug in these
files; `css/style.css` here is valid and every page links to it correctly.
It means the deployed copy on GitHub Pages is missing the `css` folder (or
serving a stale/broken commit). To fix it:

1. Open your repo on GitHub.com and check that a `css/style.css` file
   actually exists there, next to `index.html`. If it's missing, that's
   the bug — re-upload this whole folder's contents (drag the *contents*
   of `luxeeats/`, not the `luxeeats` folder itself, into the repo root).
2. Settings → Pages → confirm the source branch/folder matches where you
   pushed the files.
3. Hard-refresh the live site (Ctrl/Cmd+Shift+R) — GitHub Pages can take a
   minute or two to redeploy after a push, and browsers cache CSS
   aggressively.
4. Open the live site, press F12 → Console/Network tab, reload, and check
   for a red 404 on `style.css` — that confirms the missing-file diagnosis.

This rebuilt copy also removes a few stray, broken folders (literally
named `{css,js,assets...}`) that were sitting in the old zip — leftovers
from a shell command that didn't expand properly when the project
structure was first created. They were empty and unused, but worth
knowing about in case that's also what got uploaded to GitHub instead of
the real `css`/`js`/`assets` folders.

## Why this tech stack

Every library is loaded from a public CDN at runtime (Font Awesome, GSAP,
jsPDF, html2canvas, QRCode.js) — nothing needs to be installed locally,
which means:

- **No `npm install`.** Just open `index.html` in a browser or serve the
  folder with any static file server.
- **No build/bundle step.** What you see in the files is what runs.
- **Deploys straight to GitHub Pages.** Push the folder to a repo, turn on
  Pages for the `main` branch (root), done.
- **No database.** All restaurant/menu data lives in `js/data.js` — a
  plain JS file you edit by hand. Cart state lives in the visitor's
  browser (`localStorage`), so it needs nothing server-side.
- **No payment gateway/API key.** Payments are handled the way small
  restaurants already do it — UPI ID + QR code, shown to the customer, who
  pays in their own UPI app and confirms via WhatsApp.

## Folder structure

```
luxeeats/
├── index.html          Homepage
├── restaurant.html     Restaurant detail + menu + ordering
├── search.html         Search & filters
├── cart.html           Cart
├── checkout.html       Delivery form, payment, receipt
├── register.html       Restaurant registration (→ WhatsApp to admin)
├── admin.html          Super Admin dashboard (read-only + instructions)
├── css/style.css        Design system (all styling lives here)
├── js/
│   ├── data.js          Data layer + Firebase connection (FIREBASE_CONFIG
│   │                    at the top is the only thing you edit by hand —
│   │                    see "Connecting Firebase" below). Sample data
│   │                    here is just the local-preview starting point.
│   ├── admin.js         Super Admin dashboard logic — full CRUD.
│   ├── store.js         Cart + toast logic (localStorage)
│   ├── whatsapp.js       Builds pre-filled WhatsApp deep links
│   ├── receipt.js        Receipt render + PDF download + print
│   ├── ui.js              Shared navbar/footer/cards/animations
│   └── *.js               One file per page (home.js, restaurant.js, …)
└── assets/               Put your real images here (see below)
```

## Adding images

Every image path in `js/data.js` points into `assets/`. Drop your files in
`assets/restaurants/` (logos, covers, QR codes, gallery) and
`assets/food/` (menu item photos, hero image, banners) using the same
filenames referenced in `data.js`, or update the paths to match your
files. Until you add real images, the site falls back to free Unsplash
stock photos automatically so nothing looks broken.

## The Super Admin dashboard (now fully live — no code editing)

`admin.html` is a real control panel: new restaurant registrations,
approve/reject, pin/unpin, feature/unfeature, suspend/reactivate, edit
every field, upload images, manage the menu, edit categories, and edit
homepage/banner/announcement text — all from buttons in the browser.
Nothing needs to be typed into `js/data.js` again.

This works two ways:

- **Local preview mode** (default, nothing configured): the dashboard is
  fully clickable and shows you how everything works, but changes only
  last in your current browser tab — nobody else sees them. Good for
  trying it out before connecting a database.
- **Live mode** (recommended, ~5 minutes, free): connect a free Firebase
  project and every action publishes instantly to all visitors, synced in
  real time. Do this once and you never touch code again.

### Connecting Firebase (one-time)

1. Go to <https://console.firebase.google.com> → **Add project** (any
   name, disable Google Analytics if you don't want it).
2. **Build → Realtime Database → Create Database** → choose a region →
   start in **locked mode**.
3. **Build → Authentication → Sign-in method** → enable **Email/Password**.
   Then **Authentication → Users → Add user** — create the one login
   you'll use to sign into `admin.html`. This is your Super Admin account.
4. **Project settings** (gear icon, top left) → **General** → scroll to
   "Your apps" → click the **Web** icon (`</>`) → register an app (any
   nickname, no hosting needed) → it shows a `firebaseConfig` object.
   Copy those values into `FIREBASE_CONFIG` at the top of `js/data.js`.
5. **Realtime Database → Rules** tab → replace the rules with the block
   below → **Publish**. This version locks writes to your specific admin
   account (UID `BDxX2mKOi8Ohc96iD0DjRYKcnJJ2`) rather than any signed-in
   user, so only that one login can ever change data:

   ```json
   {
     "rules": {
       "luxeeats": {
         "restaurants": {
           ".read": true,
           ".write": "auth != null && auth.uid === 'BDxX2mKOi8Ohc96iD0DjRYKcnJJ2'"
         },
         "siteConfig": {
           ".read": true,
           ".write": "auth != null && auth.uid === 'BDxX2mKOi8Ohc96iD0DjRYKcnJJ2'"
         },
         "categories": {
           ".read": true,
           ".write": "auth != null && auth.uid === 'BDxX2mKOi8Ohc96iD0DjRYKcnJJ2'"
         },
         "registrations": {
           ".read": "auth != null && auth.uid === 'BDxX2mKOi8Ohc96iD0DjRYKcnJJ2'",
           ".write": true
         }
       }
     }
   }
   ```

   (If you ever add a second admin account later, either add its UID with
   `||` or switch back to the simpler `auth != null` rule.)

   This means: everyone can *read* restaurant/site data (so the site
   works for visitors), but only your signed-in admin account can *write*
   changes. Anyone can *submit* a registration (so the public form still
   works), but only you can *read/review* the submissions queue.

6. Commit and push `js/data.js`. Open `admin.html`, sign in with the
   email/password you created in step 3 — you're live.

The very first time it connects, it automatically copies the sample
restaurants into your new database as a starting point — from then on,
the database (not this file) is the source of truth, and `admin.html` is
the only place you manage it.

### A note on the admin login

There's still no traditional server, so "sign in" here means Firebase
Authentication directly from the browser — this is genuinely secure
(Firebase verifies the password server-side and the database rules above
reject writes from anyone not signed in), unlike a hardcoded passcode in
the page source, which anyone could read. Create/rotate your admin
password from the Firebase Console → Authentication → Users at any time.

## How ordering works end-to-end

1. Customer browses/searches restaurants, opens one, adds items to cart
   (cart is scoped to one restaurant at a time, like Swiggy/Zomato).
2. At checkout, they fill delivery details and see the restaurant's UPI
   ID + a QR code (generated client-side with QRCode.js — no image file
   needed, though you can swap in a real bank-issued QR image instead).
3. They pay in their own UPI app, optionally note the transaction ID, and
   tap **"I Have Sent Payment Receipt."**
4. This opens WhatsApp with a pre-filled message to the restaurant
   containing the full order — the customer just attaches their payment
   screenshot and hits send.
5. A **receipt** (with logo, items, totals, payment info) is generated on
   screen with **Download PDF** and **Print** buttons.
6. A **Notify Super Admin** button sends a second pre-filled WhatsApp
   message to you with the order summary.

## Configuration

Open `js/data.js` and edit the top of `SITE_CONFIG`:

```js
superAdminWhatsApp: "911234567890", // YOUR WhatsApp number, country code, no + or spaces
```

Set each restaurant's own `whatsapp` field the same way — that's where
customer orders for that restaurant get sent.

## Deploying to GitHub Pages

1. Create a new repo (or use an existing one) in your GitHub account.
2. Push this whole `luxeeats/` folder's contents to the repo root (or to
   a `/docs` folder — either works with GitHub Pages).
3. Repo → Settings → Pages → Source: deploy from the branch/folder you
   pushed to.
4. Your site is live at `https://<your-username>.github.io/<repo-name>/`.

No secrets, no environment variables, no CI needed.

## Extending it later

The structure is intentionally flat and readable so it's easy to grow:
add new pages the same way the existing ones are built (include
`css/style.css`, `js/data.js`, `js/store.js`, `js/ui.js`, then a
page-specific script). If you outgrow a hand-edited JS file for data,
the whole `RESTAURANTS` array can be swapped for a `fetch()` call to a
real backend/database later without changing any page markup — every
page already reads through the `DataStore` helper functions in
`js/data.js`, so that's the only file that would need to change.
