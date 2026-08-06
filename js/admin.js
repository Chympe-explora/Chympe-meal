/* =========================================================================
   SUPER ADMIN DASHBOARD — full CRUD over restaurants, menus, categories,
   and site settings. Every action here writes straight to Firebase (when
   connected) so changes are instantly live for every visitor. No editing
   js/data.js by hand.
   ========================================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  await DataStore.ready;

  const modeBanner = document.getElementById("modeBanner");
  const loginBox = document.getElementById("loginBox");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const localModeNote = document.getElementById("localModeNote");
  const dashboard = document.getElementById("dashboard");

  if (DataStore.isLive) {
    modeBanner.innerHTML = `<i class="fa-solid fa-satellite-dish" style="color:var(--veg);"></i> Connected to your live database — every change below publishes instantly to all visitors.`;
  } else {
    modeBanner.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--gold-bright);"></i> Local preview mode — Firebase isn't connected yet, so changes here only last for this browser tab. See <code class="mono">README.md</code> to go live (free, ~5 min).`;
    localModeNote.style.display = "block";
  }

  function showDashboard() {
    loginBox.style.display = "none";
    dashboard.style.display = "block";
    renderAll();
  }
  function showLogin() {
    loginBox.style.display = "block";
    dashboard.style.display = "none";
  }

  if (DataStore.isLive) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginError.style.display = "none";
      const fd = new FormData(loginForm);
      try {
        await DataStore.signIn(fd.get("email"), fd.get("password"));
      } catch (err) {
        loginError.textContent = "Sign-in failed — check your email and password.";
        loginError.style.display = "block";
      }
    });
    document.getElementById("signOutBtn").addEventListener("click", () => DataStore.signOut());
    DataStore.onAuthChange((user) => (user ? showDashboard() : showLogin()));
  } else {
    // no real auth possible without a backend — show the dashboard in
    // local preview mode so the admin can still see how it works
    showDashboard();
    document.getElementById("signOutBtn").style.display = "none";
  }

  window.addEventListener("luxeeats:data-updated", () => {
    if (dashboard.style.display !== "none") renderAll();
  });

  function renderAll() {
    renderRegistrations();
    renderRestaurantsTable();
    renderCategories();
    renderSiteConfigForm();
  }

  /* ===================== REGISTRATIONS ===================== */
  let regCache = {};
  DataStore.listenRegistrations((regs) => {
    regCache = regs || {};
    renderRegistrations();
  });

  function renderRegistrations() {
    const tbody = document.getElementById("regTableBody");
    const entries = Object.entries(regCache);
    if (!entries.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No pending registrations.</td></tr>`;
      return;
    }
    tbody.innerHTML = entries
      .map(
        ([regId, r]) => `
      <tr>
        <td style="color:var(--ivory);">${r.name || ""}</td>
        <td>${r.ownerName || ""}</td>
        <td>${r.phone || ""} / ${r.whatsapp || ""}</td>
        <td>${r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : ""}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-gold btn-sm" data-approve-reg="${regId}">Approve</button>
          <button class="btn btn-ghost btn-sm" data-reject-reg="${regId}">Reject</button>
        </td>
      </tr>`
      )
      .join("");

    tbody.querySelectorAll("[data-approve-reg]").forEach((btn) =>
      btn.addEventListener("click", () => openRestaurantModal(null, regCache[btn.dataset.approveReg], btn.dataset.approveReg))
    );
    tbody.querySelectorAll("[data-reject-reg]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const ok = await confirmModal("Reject and remove this registration?");
        if (ok) await DataStore.rejectRegistration(btn.dataset.rejectReg);
      })
    );
  }

  /* ===================== RESTAURANTS TABLE ===================== */
  function renderRestaurantsTable() {
    const tbody = document.getElementById("adminTableBody");
    tbody.innerHTML = RESTAURANTS.map(
      (r) => `
      <tr>
        <td style="color:var(--ivory);">${r.name}</td>
        <td><span class="status-pill status-${r.status}">${r.status}</span></td>
        <td>${r.pinned ? '<i class="fa-solid fa-check" style="color:var(--gold-bright);"></i>' : "—"}</td>
        <td>${r.featured ? '<i class="fa-solid fa-check" style="color:var(--gold-bright);"></i>' : "—"}</td>
        <td class="mono">${r.rating}</td>
        <td>${r.createdAt || ""}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-ghost btn-sm" data-act="pin" data-id="${r.id}">${r.pinned ? "Unpin" : "Pin"}</button>
          <button class="btn btn-ghost btn-sm" data-act="feature" data-id="${r.id}">${r.featured ? "Unfeature" : "Feature"}</button>
          ${
            r.status === "suspended"
              ? `<button class="btn btn-ghost btn-sm" data-act="activate" data-id="${r.id}">Reactivate</button>`
              : `<button class="btn btn-ghost btn-sm" data-act="suspend" data-id="${r.id}">Suspend</button>`
          }
          <button class="btn btn-ghost btn-sm" data-act="edit" data-id="${r.id}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-ghost btn-sm" data-act="delete" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`
    ).join("");

    tbody.querySelectorAll("[data-act]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const r = DataStore.getRestaurantById(id);
        if (!r) return;
        switch (btn.dataset.act) {
          case "pin":
            await DataStore.updateRestaurant(id, { pinned: !r.pinned });
            break;
          case "feature":
            await DataStore.updateRestaurant(id, { featured: !r.featured });
            break;
          case "suspend":
            await DataStore.updateRestaurant(id, { status: "suspended" });
            break;
          case "activate":
            await DataStore.updateRestaurant(id, { status: "approved" });
            break;
          case "edit":
            openRestaurantModal(r);
            return;
          case "delete": {
            const ok = await confirmModal(`Permanently delete "${r.name}"? This can't be undone.`);
            if (ok) await DataStore.deleteRestaurant(id);
            break;
          }
        }
        if (!DataStore.isLive) renderRestaurantsTable();
      });
    });
  }

  /* ===================== RESTAURANT ADD/EDIT MODAL ===================== */
  const modal = document.getElementById("restaurantModal");
  const form = document.getElementById("restaurantForm");
  const menuBox = document.getElementById("menuItemsBox");
  let currentImages = { logo: "", cover: "", qrCode: "", gallery: [] };
  let currentMenu = [];

  function menuRowHTML(item, idx) {
    return `
      <div class="glass" data-menu-idx="${idx}" style="padding:16px;margin-bottom:12px;">
        <div class="form-grid">
          <div class="field"><label>Item Name</label><input data-mf="name" value="${item.name || ""}" /></div>
          <div class="field"><label>Category</label><input data-mf="category" value="${item.category || ""}" /></div>
          <div class="field"><label>Price</label><input type="number" data-mf="price" value="${item.price ?? ""}" /></div>
          <div class="field"><label>Discount Price</label><input type="number" data-mf="discountPrice" value="${item.discountPrice ?? ""}" /></div>
          <div class="field full"><label>Description</label><input data-mf="description" value="${item.description || ""}" /></div>
          <div class="field"><label>Photo</label><input type="file" accept="image/*" data-mf="imageFile" /></div>
          <div class="field">
            <label>Flags</label>
            <div style="display:flex;gap:14px;align-items:center;height:44px;flex-wrap:wrap;">
              <label style="display:flex;gap:5px;align-items:center;font-size:12px;color:var(--ivory);"><input type="checkbox" data-mf="veg" ${item.veg ? "checked" : ""} style="width:15px;height:15px;" /> Veg</label>
              <label style="display:flex;gap:5px;align-items:center;font-size:12px;color:var(--ivory);"><input type="checkbox" data-mf="available" ${item.available !== false ? "checked" : ""} style="width:15px;height:15px;" /> Available</label>
              <label style="display:flex;gap:5px;align-items:center;font-size:12px;color:var(--ivory);"><input type="checkbox" data-mf="popular" ${item.popular ? "checked" : ""} style="width:15px;height:15px;" /> Popular</label>
              <label style="display:flex;gap:5px;align-items:center;font-size:12px;color:var(--ivory);"><input type="checkbox" data-mf="todaysSpecial" ${item.todaysSpecial ? "checked" : ""} style="width:15px;height:15px;" /> Special</label>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-remove-menu="${idx}" style="margin-top:10px;"><i class="fa-solid fa-trash"></i> Remove Item</button>
      </div>`;
  }

  function renderMenuBox() {
    menuBox.innerHTML = currentMenu.map((item, idx) => menuRowHTML(item, idx)).join("") || `<p style="font-size:12.5px;">No menu items yet — add one below.</p>`;
    menuBox.querySelectorAll("[data-menu-idx]").forEach((row) => {
      const idx = Number(row.dataset.menuIdx);
      row.querySelectorAll("[data-mf]").forEach((input) => {
        const key = input.dataset.mf;
        if (key === "imageFile") {
          input.addEventListener("change", async () => {
            if (input.files[0]) currentMenu[idx].image = await compressImageToDataURL(input.files[0]);
          });
        } else if (input.type === "checkbox") {
          input.addEventListener("change", () => (currentMenu[idx][key] = input.checked));
        } else {
          input.addEventListener("input", () => (currentMenu[idx][key] = input.value));
        }
      });
      row.querySelector("[data-remove-menu]").addEventListener("click", () => {
        currentMenu.splice(idx, 1);
        renderMenuBox();
      });
    });
  }

  document.getElementById("addMenuItemBtn").addEventListener("click", () => {
    currentMenu.push({ id: "item-" + Date.now(), name: "", description: "", category: "", image: "", veg: true, price: 0, discountPrice: null, available: true, todaysSpecial: false, popular: false });
    renderMenuBox();
  });

  function openRestaurantModal(existing, fromRegistration, regId) {
    form.reset();
    document.getElementById("restaurantModalTitle").textContent = existing ? "Edit Restaurant" : fromRegistration ? "Review Registration" : "Add Restaurant";
    const f = form.elements;
    const base = existing || fromRegistration || {};

    f.id.value = existing ? existing.id : "";
    f._regId.value = regId || "";
    f.name.value = base.name || "";
    f.ownerName.value = base.ownerName || "";
    f.phone.value = base.phone || "";
    f.whatsapp.value = base.whatsapp || "";
    f.cuisine.value = (base.cuisine || []).join(", ");
    f.categories.value = (base.categories || []).join(", ");
    f.address.value = base.address || "";
    f.googleMapsLink.value = base.googleMapsLink || "";
    f.description.value = base.description || "";
    f.openingHours.value = base.openingHours || "";
    f.closingHours.value = base.closingHours || "";
    f.priceForTwo.value = base.priceForTwo || 0;
    f.rating.value = base.rating ?? 4.5;
    f.reviewCount.value = base.reviewCount || 0;
    f.upiName.value = base.upiName || "";
    f.upiId.value = base.upiId || "";
    f.status.value = existing ? existing.status : "approved";
    f.pinned.checked = !!base.pinned;
    f.featured.checked = !!base.featured;

    currentImages = { logo: base.logo || "", cover: base.cover || "", qrCode: base.qrCode || "", gallery: [...(base.gallery || [])] };
    document.getElementById("logoCurrent").textContent = currentImages.logo ? "Current image set" : "No image yet";
    document.getElementById("coverCurrent").textContent = currentImages.cover ? "Current image set" : "No image yet";
    document.getElementById("qrCurrent").textContent = currentImages.qrCode ? "Current image set" : "No image yet";
    document.getElementById("galleryCurrent").textContent = `${currentImages.gallery.length} photo(s) currently`;

    currentMenu = existing ? JSON.parse(JSON.stringify(existing.menu || [])) : [];
    renderMenuBox();

    modal.classList.add("show");
  }
  function closeRestaurantModal() {
    modal.classList.remove("show");
  }
  document.getElementById("restaurantModalClose").addEventListener("click", closeRestaurantModal);
  document.getElementById("restaurantModalCancel").addEventListener("click", closeRestaurantModal);

  form.logoFile.addEventListener("change", async () => {
    if (form.logoFile.files[0]) {
      currentImages.logo = await compressImageToDataURL(form.logoFile.files[0]);
      document.getElementById("logoCurrent").textContent = "New image selected";
    }
  });
  form.coverFile.addEventListener("change", async () => {
    if (form.coverFile.files[0]) {
      currentImages.cover = await compressImageToDataURL(form.coverFile.files[0]);
      document.getElementById("coverCurrent").textContent = "New image selected";
    }
  });
  form.qrFile.addEventListener("change", async () => {
    if (form.qrFile.files[0]) {
      currentImages.qrCode = await compressImageToDataURL(form.qrFile.files[0]);
      document.getElementById("qrCurrent").textContent = "New image selected";
    }
  });
  form.galleryFiles.addEventListener("change", async () => {
    const files = [...form.galleryFiles.files];
    const compressed = await Promise.all(files.map((f) => compressImageToDataURL(f)));
    currentImages.gallery.push(...compressed.filter(Boolean));
    document.getElementById("galleryCurrent").textContent = `${currentImages.gallery.length} photo(s) currently`;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById("restaurantSaveBtn");
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

    const f = form.elements;
    const existingId = f.id.value;
    const regId = f._regId.value;
    const id = existingId || slugify(f.name.value) + "-" + Date.now().toString(36).slice(-4);

    const existing = existingId ? DataStore.getRestaurantById(existingId) : null;

    const obj = {
      id,
      status: f.status.value,
      pinned: f.pinned.checked,
      featured: f.featured.checked,
      name: f.name.value,
      ownerName: f.ownerName.value,
      logo: currentImages.logo,
      cover: currentImages.cover,
      gallery: currentImages.gallery,
      cuisine: f.cuisine.value.split(",").map((s) => s.trim()).filter(Boolean),
      description: f.description.value,
      rating: parseFloat(f.rating.value) || 0,
      reviewCount: parseInt(f.reviewCount.value) || 0,
      priceForTwo: parseInt(f.priceForTwo.value) || 0,
      openingHours: f.openingHours.value,
      closingHours: f.closingHours.value,
      phone: f.phone.value,
      whatsapp: f.whatsapp.value,
      address: f.address.value,
      googleMapsLink: f.googleMapsLink.value,
      upiName: f.upiName.value,
      upiId: f.upiId.value,
      qrCode: currentImages.qrCode,
      createdAt: existing ? existing.createdAt : new Date().toISOString().slice(0, 10),
      categories: f.categories.value.split(",").map((s) => s.trim()).filter(Boolean),
      offers: existing ? existing.offers || [] : [],
      menu: currentMenu.map((m) => ({ ...m, price: parseFloat(m.price) || 0, discountPrice: m.discountPrice === "" || m.discountPrice == null ? null : parseFloat(m.discountPrice) })),
    };

    try {
      if (regId) {
        await DataStore.approveRegistration(regId, obj);
        showToast(`${obj.name} approved and published`);
      } else {
        await DataStore.saveRestaurant(id, obj);
        showToast(existingId ? "Restaurant updated" : "Restaurant added");
      }
      closeRestaurantModal();
      if (!DataStore.isLive) renderRestaurantsTable();
    } catch (err) {
      console.warn(err);
      showToast("Couldn't save — please try again.");
    }
    saveBtn.disabled = false;
    saveBtn.innerHTML = "Save Restaurant";
  });

  document.getElementById("addRestaurantBtn").addEventListener("click", () => openRestaurantModal(null));

  /* ===================== CATEGORIES ===================== */
  let categoryDraft = [];
  function renderCategories() {
    categoryDraft = JSON.parse(JSON.stringify(CATEGORIES));
    paintCategories();
  }
  function paintCategories() {
    const box = document.getElementById("categoriesBox");
    box.innerHTML =
      categoryDraft
        .map(
          (c, i) => `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;" data-cat-idx="${i}">
        <input data-cf="id" value="${c.id}" placeholder="slug-id" style="width:140px;background:var(--umber-2);border:1px solid var(--hairline);border-radius:8px;padding:9px;color:var(--ivory);font-size:12.5px;" />
        <input data-cf="name" value="${c.name}" placeholder="Display name" style="flex:1;background:var(--umber-2);border:1px solid var(--hairline);border-radius:8px;padding:9px;color:var(--ivory);font-size:12.5px;" />
        <input data-cf="icon" value="${c.icon}" placeholder="fa-fire" style="width:130px;background:var(--umber-2);border:1px solid var(--hairline);border-radius:8px;padding:9px;color:var(--ivory);font-size:12.5px;" />
        <button type="button" class="btn btn-ghost btn-sm" data-remove-cat="${i}"><i class="fa-solid fa-trash"></i></button>
      </div>`
        )
        .join("") + `<button type="button" class="btn btn-gold btn-sm" id="saveCategoriesBtn" style="margin-top:12px;">Save Categories</button>`;

    box.querySelectorAll("[data-cat-idx]").forEach((row) => {
      const idx = Number(row.dataset.catIdx);
      row.querySelectorAll("[data-cf]").forEach((input) => {
        input.addEventListener("input", () => (categoryDraft[idx][input.dataset.cf] = input.value));
      });
      row.querySelector("[data-remove-cat]").addEventListener("click", () => {
        categoryDraft.splice(idx, 1);
        paintCategories();
      });
    });
    document.getElementById("saveCategoriesBtn").addEventListener("click", async () => {
      await DataStore.saveCategories(categoryDraft);
      showToast("Categories saved");
    });
  }
  document.getElementById("addCategoryBtn").addEventListener("click", () => {
    categoryDraft.push({ id: "", name: "", icon: "fa-utensils" });
    paintCategories();
  });

  /* ===================== SITE SETTINGS ===================== */
  function renderSiteConfigForm() {
    const f = document.getElementById("siteConfigForm").elements;
    f.siteName.value = SITE_CONFIG.siteName || "";
    f.tagline.value = SITE_CONFIG.tagline || "";
    f.heroHeadline.value = SITE_CONFIG.heroHeadline || "";
    f.heroHeadlineAccent.value = SITE_CONFIG.heroHeadlineAccent || "";
    f.heroSubtext.value = SITE_CONFIG.heroSubtext || "";
    f.announcement.value = SITE_CONFIG.announcement || "";
    f.superAdminWhatsApp.value = SITE_CONFIG.superAdminWhatsApp || "";
    f.currency.value = SITE_CONFIG.currency || "";
    f.deliveryCharge.value = SITE_CONFIG.deliveryCharge || 0;
    f.freeDeliveryAbove.value = SITE_CONFIG.freeDeliveryAbove || 0;
  }
  document.getElementById("siteConfigForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    await DataStore.updateSiteConfig({
      siteName: f.siteName.value,
      tagline: f.tagline.value,
      heroHeadline: f.heroHeadline.value,
      heroHeadlineAccent: f.heroHeadlineAccent.value,
      heroSubtext: f.heroSubtext.value,
      announcement: f.announcement.value,
      superAdminWhatsApp: f.superAdminWhatsApp.value,
      currency: f.currency.value,
      deliveryCharge: parseInt(f.deliveryCharge.value) || 0,
      freeDeliveryAbove: parseInt(f.freeDeliveryAbove.value) || 0,
    });
    showToast("Site settings saved");
  });
});
