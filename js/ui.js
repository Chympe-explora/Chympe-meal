/* =========================================================================
   SHARED UI — nav, footer, card templates, reveal-on-scroll, preloader.
   Included on every page. `data-page` on <body> marks the active nav link.
   ========================================================================= */

function starString(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function renderNav() {
  const mount = document.getElementById("nav-mount");
  if (!mount) return;
  const active = document.body.dataset.page;
  const link = (href, label, key) =>
    `<a href="${href}" class="${active === key ? "active" : ""}">${label}</a>`;

  mount.innerHTML = `
    <div class="nav-wrap">
      <nav class="nav glass">
        <a href="index.html" class="brand">
          <span class="brand-mark">L</span>
          <span class="brand-name">${SITE_CONFIG.siteName}</span>
        </a>
        <ul class="nav-links">
          <li>${link("index.html", "Home", "home")}</li>
          <li>${link("index.html#restaurants", "Restaurants", "restaurants")}</li>
          <li>${link("register.html", "Partner With Us", "register")}</li>
          <li>${link("admin.html", "Admin", "admin")}</li>
        </ul>
        <div class="nav-actions">
          <a href="cart.html" class="icon-btn" aria-label="Cart">
            <i class="fa-solid fa-bag-shopping"></i>
            <span class="cart-badge" data-cart-count style="display:none;">0</span>
          </a>
          <button class="icon-btn nav-toggle" id="mobileToggle" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        </div>
      </nav>
    </div>
    <div class="modal-overlay" id="mobileMenu">
      <div class="modal-box glass" style="text-align:center;">
        <button class="icon-btn modal-close" id="mobileClose"><i class="fa-solid fa-xmark"></i></button>
        <div style="display:flex;flex-direction:column;gap:22px;margin-top:20px;font-size:18px;font-family:'Fraunces',serif;">
          <a href="index.html">Home</a>
          <a href="index.html#restaurants">Restaurants</a>
          <a href="register.html">Partner With Us</a>
          <a href="admin.html">Admin</a>
          <a href="cart.html">Cart</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("mobileToggle")?.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.add("show");
  });
  document.getElementById("mobileClose")?.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("show");
  });
  CartStore.updateBadges();
}

function renderFooter() {
  const mount = document.getElementById("footer-mount");
  if (!mount) return;
  mount.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand" style="margin-bottom:16px;">
              <span class="brand-mark">L</span>
              <span class="brand-name">${SITE_CONFIG.siteName}</span>
            </div>
            <p style="max-width:280px;">${SITE_CONFIG.tagline} — a curated table of the city's most distinguished kitchens.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="index.html#restaurants">Restaurants</a></li>
              <li><a href="index.html#offers">Offers</a></li>
              <li><a href="cart.html">My Cart</a></li>
            </ul>
          </div>
          <div>
            <h4>Partners</h4>
            <ul>
              <li><a href="register.html">List Your Restaurant</a></li>
              <li><a href="admin.html">Admin Panel</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>Available across the city</li>
              <li>Same-day delivery</li>
              <li>support@luxeeats.example</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${SITE_CONFIG.siteName}. All rights reserved.</span>
          <span>Crafted with a taste for detail.</span>
        </div>
      </div>
    </footer>
  `;
}

function restaurantCardHTML(r) {
  return `
    <a href="restaurant.html?id=${r.id}" class="rcard glass reveal">
      <div class="rcard-img">
        <img src="${r.cover}" alt="${r.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=60'"/>
        <div class="rcard-badges">
          ${r.featured ? '<span class="tag tag-gold">Featured</span>' : ""}
          ${r.pinned ? '<span class="tag tag-dark"><i class="fa-solid fa-thumbtack"></i> Pinned</span>' : ""}
        </div>
        <div class="rcard-rating"><i class="fa-solid fa-star"></i> ${r.rating}</div>
      </div>
      <div class="rcard-body">
        <h3>${r.name}</h3>
        <p>${r.cuisine.join(" · ")}</p>
        <div class="rcard-meta">
          <span><i class="fa-regular fa-clock"></i> ${r.openingHours} - ${r.closingHours}</span>
          <span><i class="fa-solid fa-indian-rupee-sign"></i> ${r.priceForTwo} for two</span>
        </div>
      </div>
    </a>`;
}

/* =========================================================================
   CONFIRM MODAL — a glass replacement for window.confirm(), used anywhere
   we need a yes/no decision (e.g. "start a new cart with this restaurant?")
   without breaking the premium feel with a browser-native dialog.
   Returns a Promise<boolean>.
   ========================================================================= */
function confirmModal(message, { confirmLabel = "Yes, continue", cancelLabel = "Cancel" } = {}) {
  return new Promise((resolve) => {
    document.getElementById("confirmModalOverlay")?.remove();
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "confirmModalOverlay";
    overlay.innerHTML = `
      <div class="modal-box glass" style="text-align:center;">
        <p style="color:var(--ivory);font-size:15px;line-height:1.5;margin-bottom:24px;">${message}</p>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-ghost btn-block" id="confirmModalCancel">${cancelLabel}</button>
          <button class="btn btn-gold btn-block" id="confirmModalOk">${confirmLabel}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));

    const cleanup = (result) => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
      resolve(result);
    };
    overlay.querySelector("#confirmModalOk").addEventListener("click", () => cleanup(true));
    overlay.querySelector("#confirmModalCancel").addEventListener("click", () => cleanup(false));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) cleanup(false); });
  });
}

function initRevealOnScroll() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

function injectPreloader() {
  if (document.getElementById("preloader")) return;
  const pre = document.createElement("div");
  pre.id = "preloader";
  pre.innerHTML = `<div class="loader-mark">${SITE_CONFIG.siteName}</div><div class="loader-ring"></div>`;
  document.body.prepend(pre);
}

function initPreloader() {
  const pre = document.getElementById("preloader");
  if (!pre) return;
  const reveal = () => setTimeout(() => pre.classList.add("hide"), 400);
  if (document.readyState === "complete") reveal();
  else window.addEventListener("load", reveal);
  // safety net: never let the preloader block the page for more than 2.5s,
  // e.g. if a CDN script is slow or offline
  setTimeout(() => pre.classList.add("hide"), 2500);
}

function initNavScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      nav.style.boxShadow = "0 20px 50px -20px rgba(0,0,0,.6)";
    } else {
      nav.style.boxShadow = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  injectPreloader();
  initPreloader();
  await DataStore.ready;
  renderNav();
  renderFooter();
  initNavScroll();
  setTimeout(initRevealOnScroll, 50);
  window.addEventListener("luxeeats:data-updated", () => {
    renderNav();
    renderFooter();
  });
});
