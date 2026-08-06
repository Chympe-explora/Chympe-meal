document.addEventListener("DOMContentLoaded", async () => {
  await DataStore.ready;
  const form = document.getElementById("registerForm");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const fd = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;

    try {
      const [logo, cover, qrCode, ...galleryFiles] = await Promise.all([
        compressImageToDataURL(fd.get("logo")),
        compressImageToDataURL(fd.get("cover")),
        compressImageToDataURL(fd.get("qr")),
        ...fd.getAll("gallery").map((f) => compressImageToDataURL(f)),
      ]);

      const registration = {
        name: fd.get("name"),
        ownerName: fd.get("owner"),
        phone: fd.get("phone"),
        whatsapp: fd.get("whatsapp"),
        email: fd.get("email"),
        cuisine: fd.get("cuisine").split(",").map((c) => c.trim()).filter(Boolean),
        address: fd.get("address"),
        googleMapsLink: fd.get("mapsLink"),
        openingHours: fd.get("openHours"),
        closingHours: fd.get("closeHours"),
        upiName: fd.get("upiName"),
        upiId: fd.get("upiId"),
        description: fd.get("description"),
        logo,
        cover,
        qrCode,
        gallery: galleryFiles.filter(Boolean),
        submittedAt: new Date().toISOString(),
      };

      if (DataStore.isLive) {
        await DataStore.submitRegistration(registration);
        showToast("Submitted! It now appears in the Super Admin dashboard for approval.");
      } else {
        showToast("Opening WhatsApp — the live database isn't connected yet, so please also message our team directly.");
      }
    } catch (err) {
      console.warn("Registration submit failed", err);
      showToast("Couldn't submit automatically — please continue via WhatsApp.");
    }

    const message = WhatsApp.registrationMessage({
      name: fd.get("name"),
      owner: fd.get("owner"),
      phone: fd.get("phone"),
      whatsapp: fd.get("whatsapp"),
      email: fd.get("email"),
      address: fd.get("address"),
      cuisine: fd.get("cuisine"),
      mapsLink: fd.get("mapsLink"),
      upiName: fd.get("upiName"),
      upiId: fd.get("upiId"),
      openHours: fd.get("openHours"),
      closeHours: fd.get("closeHours"),
      description: fd.get("description"),
    });
    WhatsApp.open(SITE_CONFIG.superAdminWhatsApp, message);

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Submit Registration via WhatsApp`;
    form.reset();
  });
});
