/* =========================================================================
   RECEIPT — renders the receipt HTML, downloads it as PDF (html2canvas +
   jsPDF, both from CDN, no account/key needed), and supports native print.
   ========================================================================= */
const Receipt = {
  renderHTML(order) {
    const itemRows = order.items
      .map(
        (i) => `
      <div class="receipt-row">
        <span>${i.qty} x ${i.name}</span>
        <span>${SITE_CONFIG.currency}${i.price * i.qty}</span>
      </div>`
      )
      .join("");

    return `
      <div class="receipt" id="receipt-capture">
        <div class="receipt-head">
          <img src="${order.restaurantLogo}" alt="${order.restaurantName}" onerror="this.style.display='none'"/>
          <h2>${order.restaurantName}</h2>
          <div style="font-size:11px;color:#888;">Order Receipt</div>
        </div>
        <div class="receipt-row"><span>Receipt No.</span><span>${order.receiptNumber}</span></div>
        <div class="receipt-row"><span>Order No.</span><span>${order.orderNumber}</span></div>
        <div class="receipt-row"><span>Date</span><span>${order.date}</span></div>
        <div class="receipt-row"><span>Time</span><span>${order.time}</span></div>
        <div class="receipt-row"><span>Customer</span><span>${order.customer.name}</span></div>
        <div class="receipt-row"><span>Phone</span><span>${order.customer.phone}</span></div>
        <div class="receipt-row"><span>Address</span><span style="text-align:right;max-width:60%;">${order.customer.address}</span></div>
        <div class="receipt-items">${itemRows}</div>
        <div class="receipt-row"><span>Subtotal</span><span>${SITE_CONFIG.currency}${order.subtotal}</span></div>
        <div class="receipt-row"><span>Discount</span><span>-${SITE_CONFIG.currency}${order.discount || 0}</span></div>
        <div class="receipt-row"><span>Delivery Charge</span><span>${SITE_CONFIG.currency}${order.delivery}</span></div>
        <div class="receipt-row receipt-total"><span>Grand Total</span><span>${SITE_CONFIG.currency}${order.total}</span></div>
        <div class="receipt-row" style="margin-top:10px;"><span>Payment Method</span><span>${order.paymentMethod}</span></div>
        ${order.transactionId ? `<div class="receipt-row"><span>Transaction ID</span><span>${order.transactionId}</span></div>` : ""}
        <div class="receipt-foot">Thank you for ordering with Luxe Eats<br/>${SITE_CONFIG.siteName} · luxeeats.example</div>
      </div>`;
  },

  async downloadPDF(order) {
    const container = document.getElementById("receipt-capture");
    if (!container || !window.html2canvas || !window.jspdf) {
      showToast("PDF library still loading, try again in a moment", "fa-triangle-exclamation");
      return;
    }
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#fdfbf6" });
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "px", format: [canvas.width / 2, canvas.height / 2] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`${order.orderNumber}-receipt.pdf`);
  },

  print() {
    const printWindow = window.open("", "_blank");
    const receiptHTML = document.getElementById("receipt-capture").outerHTML;
    printWindow.document.write(`
      <html><head><title>Receipt</title>
      <link rel="stylesheet" href="${location.origin}${location.pathname.replace(/[^/]+$/, "")}../css/style.css">
      <style>body{background:#fff;padding:20px;} .receipt{box-shadow:none;}</style>
      </head><body>${receiptHTML}</body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 400);
  },
};
