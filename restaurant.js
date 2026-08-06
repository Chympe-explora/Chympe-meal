/* =========================================================================
   RESTAURANT DETAIL PAGE
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const r = DataStore.getRestaurantById(id);
  const root = document.getElementById("restaurantRoot");

  if (!r || r.status !== "approved") {
    root.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-utensils"></i>
        <h2>Restaurant not found</h2>
        <p>It may have been removed or is awaiting approval.</p>
        <a href="index.html" class="btn btn-gold" style="margin-top:20px;">Back to Home</a>
      </div>`;
    return;
  }

  document.title = `${r.name} — Luxe Eats`;
  setSEOTags(r);

  // group menu by category, preserving first-seen order
  const grouped = {};
  r.menu.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  const categoryNames = Object.keys(grouped);

  root.innerHTML = `
    <div class="r-hero glass">
      <img src="${r.cover}" alt="${r.name}" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=70'"/>
      <div class="r-hero-content">
        <img class="r-logo" src="${r.logo}" alt="${r.name} logo" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=60'"/>
        <div class="r-title">
          <h1>${r.name}</h1>
          <div class="rcard-meta">
            <span><i class="fa-solid fa-star" style="color:#e9cc8c;"></i> ${r.rating} (${r.reviewCount})</span>
            <span>${r.cuisine.join(" · ")}</span>
            <span><i class="fa-regular fa-clock"></i> ${r.openingHours} - ${r.closingHours}</span>
          </div>
        </div>
        <div class="r-actions">
          <a href="${r.googleMapsLink}" target="_blank" class="btn btn-ghost btn-sm"><i class="fa-solid fa-location-dot"></i> Map</a>
          <a href="${WhatsApp.link(r.whatsapp, `Hi ${r.name}, I have a question about your menu.`)}" target="_blank" class="btn btn-gold btn-sm"><i class="fa-brands fa-whatsapp"></i> Chat</a>
        </div>
      </div>
    </div>

    <div class="r-layout">
      <div>
        <p style="max-width:640px;margin:24px 0 0;">${r.description}</p>

        <div class="r-tabs">
          <a href="#menu" class="r-tab active" data-tab="menu">Menu</a>
          <a href="#gallery" class="r-tab" data-tab="gallery">Gallery</a>
          <a href="#info" class="r-tab" data-tab="info">Info</a>
        </div>

        <div id="menuPane">
          ${
            categoryNames.length
              ? categoryNames
                  .map(
                    (cat) => `
              <h3 class="menu-cat-title">${cat}</h3>
              ${grouped[cat].map((item) => menuItemHTML(r, item)).join("")}
            `
                  )
                  .join("")
              : `<div class="empty-state"><i class="fa-solid fa-utensils"></i><h2>Menu coming soon</h2><p>${r.name} hasn't published their menu yet.</p></div>`
          }
        </div>

        <div id="galleryPane" style="display:none;">
          ${
            r.gallery.length
              ? `<div class="gallery-grid">
                  ${r.gallery.map((g) => `<img src="${g}" alt="${r.name} gallery" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=60'"/>`).join("")}
                </div>`
              : `<div class="empty-state"><i class="fa-regular fa-images"></i><h2>No photos yet</h2><p>${r.name} hasn't added gallery photos.</p></div>`
          }
        </div>

        <div id="infoPane" style="display:none;">
          <div class="info-panel glass">
            <div class="info-row"><i class="fa-solid fa-location-dot"></i><span>${r.address}</span></div>
            <div class="info-row"><i class="fa-regular fa-clock"></i><span>${r.openingHours} – ${r.closingHours} daily</span></div>
            <div class="info-row"><i class="fa-solid fa-phone"></i><span>${r.phone}</span></div>
          </div>
        </div>
      </div>

      <aside>
        <div class="info-panel glass">
          <h4 style="font-family:'Fraunces',serif;font-size:16px;">Restaurant Info</h4>
          <div class="info-row"><i class="fa-solid fa-location-dot"></i><span class="muted">${r.address}</span></div>
          <div class="info-row"><i class="fa-regular fa-clock"></i><span class="muted">${r.openingHours} – ${r.closingHours}</span></div>
          <a href="${r.googleMapsLink}" target="_blank" class="btn btn-ghost btn-block btn-sm"><i class="fa-solid fa-map"></i> View on Google Maps</a>
        </div>

        ${
          r.offers.length
            ? `<div class="info-panel glass">
                <h4 style="font-family:'Fraunces',serif;font-size:16px;">Offers</h4>
                ${r.offers.map((o) => `<div class="info-row"><i class="fa-solid fa-tag"></i><span>${o.label} <span class="mono" style="color:var(--gold-bright);">(${o.code})</span></span></div>`).join("")}
              </div>`
            : ""
        }

        <div class="info-panel glass">
          <h4 style="font-family:'Fraunces',serif;font-size:16px;">Payment</h4>
          <div class="qr-wrap">
            <img src="${r.qrCode}" alt="UPI QR code" onerror="this.style.display='none'"/>
            <div class="upi-id-box">
              <span>${r.upiId}</span>
              <button class="copy-btn" onclick="navigator.clipboard.writeText('${r.upiId}');showToast('UPI ID copied')"><i class="fa-regular fa-copy"></i></button>
            </div>
            <a href="upi://pay?pa=${r.upiId}&pn=${encodeURIComponent(r.upiName)}" class="btn btn-gold btn-block btn-sm">Open UPI App</a>
          </div>
        </div>
      </aside>
    </div>
  `;

  // tab switching
  document.querySelectorAll(".r-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".r-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      ["menu", "gallery", "info"].forEach((p) => {
        document.getElementById(`${p}Pane`).style.display = p === tab.dataset.tab ? "block" : "none";
      });
    });
  });

  renderQtyControls(r);
});

function setSEOTags(r) {
  const desc = `${r.name} — ${r.cuisine.join(", ")}. ${r.description}`.slice(0, 155);
  document.getElementById("metaDescription")?.setAttribute("content", desc);
  document.getElementById("ogTitle")?.setAttribute("content", `${r.name} — Luxe Eats`);
  document.getElementById("ogDescription")?.setAttribute("content", desc);
  document.getElementById("ogImage")?.setAttribute("content", r.cover);

  // Schema.org structured data — helps this page show rich results
  // (rating, price range, hours) in search engines
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: r.name,
    image: r.cover,
    description: r.description,
    servesCuisine: r.cuisine,
    address: { "@type": "PostalAddress", streetAddress: r.address },
    telephone: r.phone,
    priceRange: `₹₹ (~${SITE_CONFIG.currency}${r.priceForTwo} for two)`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: r.rating,
      reviewCount: r.reviewCount,
    },
    openingHours: `${r.openingHours}-${r.closingHours}`,
    menu: `${window.location.origin}${window.location.pathname}?id=${r.id}`,
  });
  document.head.appendChild(ld);
}

function menuItemHTML(r, item) {
  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
  return `
    <div class="menu-item" data-item-id="${item.id}">
      <img class="menu-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=60'"/>
      <div class="menu-item-info">
        <div class="menu-item-name"><span class="veg-dot ${item.veg ? "" : "nonveg"}"></span>${item.name}</div>
        <div class="menu-item-desc">${item.description}</div>
        <div class="badge-row">
          ${item.todaysSpecial ? '<span class="badge-mini badge-special">Today\'s Special</span>' : ""}
          ${item.popular ? '<span class="badge-mini badge-popular">Popular</span>' : ""}
          ${!item.available ? '<span class="badge-mini badge-popular">Sold Out</span>' : ""}
        </div>
      </div>
      <div class="menu-item-right">
        <div class="price-row">
          ${hasDiscount ? `<span class="price-strike">${SITE_CONFIG.currency}${item.price}</span>` : ""}
          <span class="price-now">${SITE_CONFIG.currency}${item.discountPrice || item.price}</span>
        </div>
        <div class="item-cart-control" data-control-for="${item.id}"></div>
      </div>
    </div>`;
}

function renderQtyControls(r) {
  r.menu.forEach((item) => {
    const el = document.querySelector(`[data-control-for="${item.id}"]`);
    if (!el) return;
    const paint = () => {
      const qty = CartStore.getQty(item.id);
      if (!item.available) {
        el.innerHTML = `<button class="add-btn" disabled>Sold Out</button>`;
        return;
      }
      if (qty === 0) {
        el.innerHTML = `<button class="add-btn">Add</button>`;
        el.querySelector("button").addEventListener("click", async () => {
          const ok = await CartStore.addItem(r.id, item, 1);
          if (ok) { showToast(`${item.name} added to cart`); paint(); }
        });
      } else {
        el.innerHTML = `
          <div class="qty-stepper">
            <button data-act="dec"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-val">${qty}</span>
            <button data-act="inc"><i class="fa-solid fa-plus"></i></button>
          </div>`;
        el.querySelector('[data-act="inc"]').addEventListener("click", async () => {
          await CartStore.addItem(r.id, item, 1);
          paint();
        });
        el.querySelector('[data-act="dec"]').addEventListener("click", () => {
          CartStore.setQty(item.id, qty - 1);
          paint();
        });
      }
    };
    paint();
  });
}
