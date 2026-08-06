/* =========================================================================
   CHECKOUT PAGE
   ========================================================================= */
let currentOrder = null;

function renderCheckout() {
  const cart = CartStore.read();
  const root = document.getElementById("checkoutRoot");

  if (!cart.items.length) {
    root.innerHTML = `<div class="empty-state glass" style="grid-column:1/-1;"><i class="fa-solid fa-bag-shopping"></i><h2>Your cart is empty</h2><a href="index.html" class="btn btn-gold" style="margin-top:20px;">Browse Restaurants</a></div>`;
    return;
  }

  const r = DataStore.getRestaurantById(cart.restaurantId);

  root.innerHTML = `
    <div>
      <div class="eyebrow">Step 1</div>
      <h2 style="margin-bottom:22px;">Delivery Details</h2>
      <form id="deliveryForm" class="glass" style="padding:26px;">
        <div class="form-grid">
          <div class="field"><label>Full Name</label><input type="text" name="name" required /></div>
          <div class="field"><label>Phone Number</label><input type="tel" name="phone" required /></div>
          <div class="field full"><label>Delivery Address</label><textarea name="address" required></textarea></div>
          <div class="field full"><label>Special Instructions (optional)</label><input type="text" name="instructions" placeholder="e.g. less spicy, ring the bell" /></div>
        </div>
      </form>

      <div class="eyebrow" style="margin-top:36px;">Step 2</div>
      <h2 style="margin-bottom:22px;">Payment</h2>
      <div class="glass" style="padding:26px;">
        <div class="pay-options" style="margin-bottom:22px;">
          <div class="pay-opt active" data-pay="upi"><i class="fa-solid fa-mobile-screen"></i>UPI App</div>
          <div class="pay-opt" data-pay="qr"><i class="fa-solid fa-qrcode"></i>Scan QR Code</div>
        </div>
        <div class="qr-wrap">
          <div id="qrHolder"></div>
          <div class="upi-id-box">
            <span>${r.upiId}</span>
            <button type="button" class="copy-btn" onclick="navigator.clipboard.writeText('${r.upiId}');showToast('UPI ID copied')"><i class="fa-regular fa-copy"></i></button>
          </div>
          <a href="upi://pay?pa=${r.upiId}&pn=${encodeURIComponent(r.upiName)}&am=${CartStore.grandTotal()}" class="btn btn-gold btn-block" id="openUpiBtn">Open UPI App to Pay ${SITE_CONFIG.currency}${CartStore.grandTotal()}</a>
        </div>
        <div class="field" style="margin-top:18px;">
          <label>Transaction ID (optional)</label>
          <input type="text" id="transactionId" placeholder="e.g. 4839201029" />
        </div>
      </div>
    </div>

    <div class="summary-panel glass">
      <h3 style="margin-bottom:18px;">Order Summary</h3>
      <div style="max-height:220px;overflow-y:auto;margin-bottom:12px;">
        ${cart.items.map((i) => `<div class="summary-row"><span>${i.qty} x ${i.name}</span><span class="mono">${SITE_CONFIG.currency}${i.price * i.qty}</span></div>`).join("")}
      </div>
      <div class="summary-row"><span>Subtotal</span><span class="mono">${SITE_CONFIG.currency}${CartStore.subtotal()}</span></div>
      <div class="summary-row"><span>Delivery</span><span class="mono">${CartStore.deliveryCharge() === 0 ? "Free" : SITE_CONFIG.currency + CartStore.deliveryCharge()}</span></div>
      <div class="summary-row total"><span>Grand Total</span><span class="mono">${SITE_CONFIG.currency}${CartStore.grandTotal()}</span></div>
      <button class="btn btn-gold btn-block" id="confirmOrderBtn" style="margin-top:20px;">
        <i class="fa-brands fa-whatsapp"></i> I Have Sent Payment Receipt
      </button>
      <p style="font-size:11.5px;margin-top:10px;">You'll confirm on WhatsApp and attach your payment screenshot there.</p>
    </div>
  `;

  // QR code render (QRCode.js from CDN — no key/account needed)
  const qrHolder = document.getElementById("qrHolder");
  if (window.QRCode) {
    new QRCode(qrHolder, {
      text: `upi://pay?pa=${r.upiId}&pn=${encodeURIComponent(r.upiName)}&am=${CartStore.grandTotal()}`,
      width: 190, height: 190, colorDark: "#1a1a1a", colorLight: "#ffffff",
    });
  }

  document.querySelectorAll(".pay-opt").forEach((opt) => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".pay-opt").forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
    });
  });

  document.getElementById("confirmOrderBtn").addEventListener("click", () => handleConfirmOrder(r, cart));
}

function handleConfirmOrder(r, cart) {
  const form = document.getElementById("deliveryForm");
  if (!form.reportValidity()) return;

  const fd = new FormData(form);
  const activePayOpt = document.querySelector(".pay-opt.active").dataset.pay;
  const now = new Date();

  currentOrder = {
    orderNumber: "LX" + Date.now().toString().slice(-8),
    receiptNumber: "RC" + Date.now().toString().slice(-8),
    restaurantId: r.id,
    restaurantName: r.name,
    restaurantLogo: r.logo,
    restaurantWhatsapp: r.whatsapp,
    customer: {
      name: fd.get("name"),
      phone: fd.get("phone"),
      address: fd.get("address"),
    },
    instructions: fd.get("instructions") || "",
    items: cart.items,
    subtotal: CartStore.subtotal(),
    discount: 0,
    delivery: CartStore.deliveryCharge(),
    total: CartStore.grandTotal(),
    paymentMethod: activePayOpt === "upi" ? "UPI" : "UPI (QR Code)",
    transactionId: document.getElementById("transactionId").value || "",
    date: now.toLocaleDateString("en-IN"),
    time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };

  OrderStore.save(currentOrder);
  document.getElementById("receiptMount").innerHTML = Receipt.renderHTML(currentOrder);
  document.getElementById("receiptModal").classList.add("show");

  // auto-open WhatsApp to restaurant right away, per the required workflow
  WhatsApp.open(currentOrder.restaurantWhatsapp, WhatsApp.orderToRestaurantMessage(currentOrder));

  CartStore.clear();
}

document.getElementById("closeReceiptModal")?.addEventListener("click", () => {
  document.getElementById("receiptModal").classList.remove("show");
});
document.getElementById("downloadPdfBtn")?.addEventListener("click", () => currentOrder && Receipt.downloadPDF(currentOrder));
document.getElementById("printReceiptBtn")?.addEventListener("click", () => currentOrder && Receipt.print());
document.getElementById("whatsappRestaurantBtn")?.addEventListener("click", () => {
  if (currentOrder) WhatsApp.open(currentOrder.restaurantWhatsapp, WhatsApp.orderToRestaurantMessage(currentOrder));
});
document.getElementById("whatsappAdminBtn")?.addEventListener("click", () => {
  if (currentOrder) WhatsApp.open(SITE_CONFIG.superAdminWhatsApp, WhatsApp.orderToAdminMessage(currentOrder));
});

document.addEventListener("DOMContentLoaded", renderCheckout);
