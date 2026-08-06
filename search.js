document.addEventListener("DOMContentLoaded", async () => {
  await DataStore.ready;
  const params = new URLSearchParams(window.location.search);
  const searchInput = document.getElementById("searchInput");
  searchInput.value = params.get("q") || "";

  const categoryParam = params.get("category") || "";
  let activeQuickFilter = "all";

  // populate cuisine dropdown from data
  const cuisines = new Set();
  DataStore.getVisibleRestaurants().forEach((r) => r.cuisine.forEach((c) => cuisines.add(c)));
  const cuisineSelect = document.getElementById("cuisineFilter");
  [...cuisines].sort().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    cuisineSelect.appendChild(opt);
  });

  function applyFilters() {
    let results = DataStore.searchRestaurants(searchInput.value);

    if (categoryParam) {
      results = results.filter((r) => r.categories.includes(categoryParam));
    }
    if (activeQuickFilter === "featured") results = results.filter((r) => r.featured);
    if (activeQuickFilter === "pinned") results = results.filter((r) => r.pinned);
    if (activeQuickFilter === "new") {
      const sorted = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      results = sorted.slice(0, Math.max(4, Math.ceil(sorted.length / 2)));
    }

    const cuisineVal = cuisineSelect.value;
    if (cuisineVal) results = results.filter((r) => r.cuisine.includes(cuisineVal));

    const ratingVal = parseFloat(document.getElementById("ratingFilter").value);
    results = results.filter((r) => r.rating >= ratingVal);

    const priceVal = parseFloat(document.getElementById("priceFilter").value);
    results = results.filter((r) => r.priceForTwo <= priceVal);

    const grid = document.getElementById("resultsGrid");
    const noResults = document.getElementById("noResults");
    if (results.length === 0) {
      grid.innerHTML = "";
      noResults.style.display = "block";
    } else {
      noResults.style.display = "none";
      grid.innerHTML = results.map(restaurantCardHTML).join("");
    }
  }

  searchInput.addEventListener("input", applyFilters);
  document.getElementById("cuisineFilter").addEventListener("change", applyFilters);
  document.getElementById("ratingFilter").addEventListener("change", applyFilters);
  document.getElementById("priceFilter").addEventListener("change", applyFilters);
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeQuickFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  applyFilters();
});
