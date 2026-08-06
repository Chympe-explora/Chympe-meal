/* =========================================================================
   CART PAGE
   ========================================================================= */
function renderCartPage() {
  const cart = CartStore.read();
  const root = document.getElementById("cartRoot");

  if (!cart.items.length) {
    root.innerHTML = `
      <div class="empty-state glass" style="grid-column:1/-1;">
        <i class="fa-solid fa-bag-shopping"></i>
        <h2>Your cart is empty</h2>
        <p>Browse our curated kitchens and add something delicious.</p>
        <a href="index.html" class="btn btn-gold" style="margin-top:22px;">Browse Restaurants</a>
      </div>`;
    return;
  }

  const restaurant = DataStore.getRestaurantById(cart.restaurantId);

  root.innerHTML = `
    <div>
      <div class="eyebrow">Ordering from</div>
      <h2 style="margin-bottom:24px;">${restaurant ? restaurant.name : "Restaurant"}</h2>
      <div class="glass" style="padding:6px 26px;">
        ${cart.items
          .map(
            (i) => `
          <div class="cart-line" data-line-id="${i.id}">
            <img src="${i.image}" alt="${i.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60'"/>
            <div class="cart-line-info">
              <div class="r-name">${i.veg ? "Veg" : "Non-Veg"}</div>
              <div style="font-family:'Fraunces',serif;font-size:16px;">${i.name}</div>
              <div class="mono" style="font-size:13px;color:var(--gold-bright);margin-top:4px;">${SITE_CONFIG.currency}${i.price} x ${i.qty}</div>
            </div>
            <div class="qty-stepper">
              <button data-act="dec"><i class="fa-solid fa-minus"></i></button>
              <span class="qty-val">${i.qty}</span>
              <button data-act="inc"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="remove-btn" data-act="remove"><i class="fa-solid fa-trash"></i></button>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div class="summary-panel glass">
      <h3 style="margin-bottom:18px;">Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span class="mono">${SITE_CONFIG.currency}${CartStore.subtotal()}</span></div>
      <div class="summary-row"><span>Delivery Charge</span><span class="mono">${CartStore.deliveryCharge() === 0 ? "Free" : SITE_CONFIG.currency + CartStore.deliveryCharge()}</span></div>
      <div class="summary-row total"><span>Grand Total</span><span class="mono">${SITE_CONFIG.currency}${CartStore.grandTotal()}</span></div>
      <a href="checkout.html" class="btn btn-gold btn-block" style="margin-top:20px;">Proceed to Checkout <i class="fa-solid fa-arrow-right"></i></a>
      <a href="index.html" class="btn btn-ghost btn-block" style="margin-top:10px;">Add More Items</a>
    </div>
  `;

  root.querySelectorAll(".cart-line").forEach((line) => {
    const itemId = line.dataset.lineId;
    line.querySelector('[data-act="inc"]').addEventListener("click", () => {
      CartStore.setQty(itemId, CartStore.getQty(itemId) + 1);
      renderCartPage();
    });
    line.querySelector('[data-act="dec"]').addEventListener("click", () => {
      CartStore.setQty(itemId, CartStore.getQty(itemId) - 1);
      renderCartPage();
    });
    line.querySelector('[data-act="remove"]').addEventListener("click", () => {
      CartStore.removeItem(itemId);
      showToast("Item removed");
      renderCartPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await DataStore.ready;
  renderCartPage();
});
