# Luxe Eats — Multi-Restaurant Food Ordering Platform

A premium, luxury-glassmorphism food ordering website. Pure HTML/CSS/JS —
no build step, no npm install, no backend, no database, no API keys, no
accounts beyond the ones you already have (GitHub, WhatsApp).

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
│   ├── data.js          ALL restaurant/menu/site data — edit this to
│   │                    add, approve, pin, feature, suspend, or remove
│   │                    restaurants, or to edit banners/offers.
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

## The Super Admin workflow (no backend, by design)

Every admin action the brief asked for is possible — just done by hand,
by editing `js/data.js`, because there is intentionally no server to host
an admin API:

| Action | How |
|---|---|
| Approve a new restaurant | Copy the `RESTAURANT TEMPLATE` comment block at the top of `js/data.js`, fill it in with what the owner sent you on WhatsApp, paste it into the `RESTAURANTS` array. |
| Reject | Don't add it. |
| Pin / Unpin | Toggle `pinned: true / false` |
| Feature / Unfeature | Toggle `featured: true / false` |
| Suspend | Set `status: "suspended"` (keeps the data, hides it from customers) |
| Remove | Delete the object from `RESTAURANTS` |
| Correct names / spelling | Edit the string directly |
| Edit categories | Edit the `CATEGORIES` array |
| Edit homepage / banners / offers / announcement | Edit `SITE_CONFIG` |

Commit and push — GitHub Pages redeploys automatically.

The `admin.html` page gives you a live read-only table of every
restaurant's current status so you can see what needs attention, plus
this same instruction set on-page.

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
