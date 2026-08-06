/* =========================================================================
   HOMEPAGE LOGIC
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // ---- hero copy ----
  document.getElementById("heroHeadline").innerHTML =
    `${SITE_CONFIG.heroHeadline}<br/><span class="accent">${SITE_CONFIG.heroHeadlineAccent}</span>`;
  document.getElementById("heroSubtext").textContent = SITE_CONFIG.heroSubtext;

  // ---- categories ----
  const catScroll = document.getElementById("categoryScroll");
  catScroll.innerHTML = CATEGORIES.map(
    (c) => `
    <a href="index.html?category=${c.id}#restaurants" class="cat-card glass reveal">
      <i class="fa-solid ${c.icon}"></i>
      <span>${c.name}</span>
    </a>`
  ).join("");

  // ---- featured ----
  document.getElementById("featuredGrid").innerHTML =
    DataStore.getFeatured().map(restaurantCardHTML).join("") ||
    `<p>No featured restaurants yet.</p>`;

  // ---- pinned (horizontal) ----
  document.getElementById("pinnedRow").innerHTML = DataStore.getPinned()
    .map((r) => `<div style="min-width:300px;">${restaurantCardHTML(r)}</div>`)
    .join("");

  // ---- popular / newest ----
  document.getElementById("popularGrid").innerHTML = DataStore.getPopular(6).map(restaurantCardHTML).join("");
  document.getElementById("newestGrid").innerHTML = DataStore.getNewest(6).map(restaurantCardHTML).join("");

  // ---- offers ----
  const offerCards = [];
  DataStore.getVisibleRestaurants().forEach((r) => {
    r.offers.forEach((o) => {
      offerCards.push(`
        <a href="restaurant.html?id=${r.id}" class="offer-card glass reveal">
          <span class="badge-num">%</span>
          <div style="font-family:'Fraunces',serif;font-size:16px;">${o.label}</div>
          <div class="rcard-meta"><span>${r.name}</span></div>
          <span class="tag tag-dark mono" style="align-self:flex-start;">${o.code}</span>
        </a>`);
    });
  });
  document.getElementById("offersRow").innerHTML =
    offerCards.join("") || `<p>No active offers right now — check back soon.</p>`;

  // ---- trending dishes ----
  document.getElementById("trendingRow").innerHTML = DataStore.getTrendingFoods(10)
    .map(
      (f) => `
      <a href="restaurant.html?id=${f.restaurantId}" class="rcard glass reveal" style="min-width:230px;">
        <div class="rcard-img" style="height:150px;">
          <img src="${f.image}" alt="${f.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=60'"/>
          ${f.todaysSpecial ? '<div class="rcard-badges"><span class="tag tag-gold">Today\'s Special</span></div>' : ""}
        </div>
        <div class="rcard-body" style="padding:16px;">
          <h3 style="font-size:15.5px;">${f.name}</h3>
          <p style="font-size:12px;">${f.restaurantName}</p>
        </div>
      </a>`
    )
    .join("");

  // ---- reviews (static curated copy, editable here) ----
  const REVIEWS = [
    { name: "Aarav M.", rating: 5, quote: "Ordered from The Copper Tandoor — arrived hot, plated like a restaurant, not a delivery box." },
    { name: "Priya S.", rating: 5, quote: "Bella Vista's risotto travels better than most pizza places' pizza. Genuinely impressed." },
    { name: "Kabir R.", rating: 4, quote: "Sakura House ramen at home, still steaming. The checkout with WhatsApp confirmation felt effortless." },
    { name: "Meera T.", rating: 5, quote: "The whole ordering experience feels considered — from search to receipt." },
  ];
  document.getElementById("reviewsRow").innerHTML = REVIEWS.map(
    (r) => `
    <div class="review-card glass reveal">
      <div class="review-stars">${starString(r.rating)}</div>
      <div class="review-quote">"${r.quote}"</div>
      <div class="review-name">${r.name}</div>
    </div>`
  ).join("");

  // ---- search ----
  const doSearch = () => {
    const q = document.getElementById("heroSearch").value;
    if (q.trim()) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
  };
  document.getElementById("heroSearchBtn").addEventListener("click", doSearch);
  document.getElementById("heroSearch").addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });

  setTimeout(initRevealOnScroll, 60);

  // ---- GSAP hero entrance ----
  if (window.gsap) {
    gsap.from(".hero .eyebrow, .hero h1, .hero .lead, .hero-actions, .search-shell", {
      y: 26, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.3,
    });
    gsap.from(".hero-visual", { x: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.4 });
    gsap.from(".hero-floater", { scale: 0.85, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.9, ease: "back.out(1.7)" });
  }
});
