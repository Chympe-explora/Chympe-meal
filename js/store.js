/* =========================================================================
   CART STORE — persisted to localStorage. Cart is scoped to ONE restaurant
   at a time (like every major food app) to keep checkout + delivery simple.
   ========================================================================= */
const CartStore = {
  KEY: "luxeeats_cart_v1",

  read() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : { restaurantId: null, items: [] };
    } catch (e) {
      return { restaurantId: null, items: [] };
    }
  },

  write(cart) {
    localStorage.setItem(this.KEY, JSON.stringify(cart));
    this.updateBadges();
  },

  clear() {
    this.write({ restaurantId: null, items: [] });
  },

  async addItem(restaurantId, item, qty = 1) {
    const cart = this.read();
    // switching restaurants clears the cart, like Zomato/Swiggy
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      const proceed = await confirmModal(
        "Your cart has items from another restaurant. Starting a new order here will clear it.",
        { confirmLabel: "Start New Cart", cancelLabel: "Keep Current Cart" }
      );
      if (!proceed) return false;
      cart.items = [];
    }
    cart.restaurantId = restaurantId;
    const existing = cart.items.find((i) => i.id === item.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({
        id: item.id,
        name: item.name,
        price: item.discountPrice || item.price,
        image: item.image,
        veg: item.veg,
        qty,
      });
    }
    this.write(cart);
    return true;
  },

  setQty(itemId, qty) {
    const cart = this.read();
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return;
    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      item.qty = qty;
    }
    if (cart.items.length === 0) cart.restaurantId = null;
    this.write(cart);
  },

  removeItem(itemId) {
    this.setQty(itemId, 0);
  },

  getQty(itemId) {
    const cart = this.read();
    const item = cart.items.find((i) => i.id === itemId);
    return item ? item.qty : 0;
  },

  count() {
    return this.read().items.reduce((sum, i) => sum + i.qty, 0);
  },

  subtotal() {
    return this.read().items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  deliveryCharge() {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return sub >= SITE_CONFIG.freeDeliveryAbove ? 0 : SITE_CONFIG.deliveryCharge;
  },

  grandTotal() {
    return this.subtotal() + this.deliveryCharge();
  },

  updateBadges() {
    const count = this.count();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  },
};

/* =========================================================================
   TOASTS
   ========================================================================= */
function showToast(message, icon = "fa-circle-check") {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "toast glass";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all .3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/* =========================================================================
   ORDER RECORD — used to pass order details from Checkout -> Receipt page
   ========================================================================= */
const OrderStore = {
  KEY: "luxeeats_last_order_v1",
  save(order) { sessionStorage.setItem(this.KEY, JSON.stringify(order)); },
  get() {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : null;
  },
};

document.addEventListener("DOMContentLoaded", () => CartStore.updateBadges());
