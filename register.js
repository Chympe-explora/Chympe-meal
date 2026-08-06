document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const fd = new FormData(form);

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
    showToast("Opening WhatsApp — attach your images in the chat");
  });
});
