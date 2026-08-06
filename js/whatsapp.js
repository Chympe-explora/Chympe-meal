/* =========================================================================
   WHATSAPP MESSAGE BUILDERS
   No API/account needed — these just build a wa.me deep link with a
   pre-filled, URL-encoded message. Opening it hands off to WhatsApp.
   ========================================================================= */
const WhatsApp = {
  link(phone, message) {
    const cleanPhone = String(phone).replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  },

  open(phone, message) {
    window.open(this.link(phone, message), "_blank");
  },

  registrationMessage(data) {
    return [
      "*NEW RESTAURANT REGISTRATION*",
      `Restaurant: ${data.name}`,
      `Owner: ${data.owner}`,
      `Phone: ${data.phone}`,
      `WhatsApp: ${data.whatsapp}`,
      `Email: ${data.email}`,
      `Address: ${data.address}`,
      `Cuisine: ${data.cuisine}`,
      `Google Maps: ${data.mapsLink}`,
      `UPI Name: ${data.upiName}`,
      `UPI ID: ${data.upiId}`,
      `Hours: ${data.openHours} - ${data.closeHours}`,
      "",
      `Description: ${data.description}`,
      "",
      "_Logo, cover, QR code and gallery images will be shared separately in this chat._",
    ].join("\n");
  },

  orderToRestaurantMessage(order) {
    const lines = [
      `*NEW ORDER — ${order.orderNumber}*`,
      `Restaurant: ${order.restaurantName}`,
      "",
      `Customer: ${order.customer.name}`,
      `Phone: ${order.customer.phone}`,
      `Address: ${order.customer.address}`,
      "",
      "*Items:*",
    ];
    order.items.forEach((i) => {
      lines.push(`• ${i.qty} x ${i.name} — ${SITE_CONFIG.currency}${i.price * i.qty}`);
    });
    lines.push("");
    lines.push(`Subtotal: ${SITE_CONFIG.currency}${order.subtotal}`);
    lines.push(`Delivery: ${SITE_CONFIG.currency}${order.delivery}`);
    lines.push(`*Grand Total: ${SITE_CONFIG.currency}${order.total}*`);
    lines.push("");
    lines.push(`Payment Method: ${order.paymentMethod}`);
    if (order.transactionId) lines.push(`Transaction ID: ${order.transactionId}`);
    lines.push(`Date: ${order.date}`);
    lines.push(`Time: ${order.time}`);
    if (order.instructions) lines.push(`Special Instructions: ${order.instructions}`);
    lines.push("");
    lines.push("_Payment screenshot attached below._");
    return lines.join("\n");
  },

  orderToAdminMessage(order) {
    return [
      "*ORDER NOTIFICATION*",
      `Restaurant: ${order.restaurantName}`,
      `Customer: ${order.customer.name}`,
      `Order Total: ${SITE_CONFIG.currency}${order.total}`,
      `Payment Method: ${order.paymentMethod}`,
      `Order Time: ${order.time}, ${order.date}`,
      `Order Number: ${order.orderNumber}`,
    ].join("\n");
  },
};
