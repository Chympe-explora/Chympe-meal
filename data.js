/* =========================================================================
   LUXE EATS — DATA LAYER
   =========================================================================
   All restaurant/menu/site data lives here AND (once you connect a free
   Firebase project below) syncs live to a real database, so every action
   in the Super Admin dashboard — approve, pin, feature, suspend, edit,
   delete, upload images — is done by clicking buttons in admin.html and
   is instantly visible to every visitor. No code editing required.

   SETUP (one-time, ~5 minutes, free):
   1. Go to https://console.firebase.google.com -> Add project (any name).
   2. Build > Realtime Database -> Create Database -> start in LOCKED mode.
   3. Build > Authentication -> Sign-in method -> enable "Email/Password".
      Then Authentication > Users > Add user -> create YOUR admin login
      (this is the only account that can make changes).
   4. Project settings (gear icon) > General > "Your apps" > Web app (</>)
      -> register an app -> copy the firebaseConfig object it gives you
      and paste its values into FIREBASE_CONFIG below.
   5. Realtime Database > Rules tab -> paste the rules from README.md
      under "Firebase security rules" -> Publish.
   6. Push this file to GitHub. Done — admin.html now logs in with that
      email/password and every change is live for all visitors.

   Until you do this, the site runs in LOCAL MODE: it works fully off the
   sample data below, and the admin dashboard still works, but changes
   only last for your current browser tab (nothing is shared with real
   visitors). DataStore.isLive tells every page which mode it's in.
   ========================================================================= */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDbOBVeuvVqdhVoe8KNm3KZFdhL3XrwOCU",
  authDomain: "chympe-order.firebaseapp.com",
  databaseURL: "https://chympe-order-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chympe-order",
  storageBucket: "chympe-order.firebasestorage.app",
  messagingSenderId: "1050322285326",
  appId: "1:1050322285326:web:27ba64c29990610350dd5f",
};

// ---------------------------------------------------------------------------
// SITE-WIDE CONFIG — homepage hero, banners, announcement bar, super admin
// contact. Editable live from admin.html > Site Settings once Firebase is
// connected (see above); these are just the starting values.
// ---------------------------------------------------------------------------
const SITE_CONFIG = {
  siteName: "Luxe Eats",
  tagline: "Food for the Falls & the Cave",
  heroHeadline: "Fuel Your Krem Chympe",
  heroHeadlineAccent: "Adventure",
  heroSubtext:
    "Order trail packs, camp dinners, and cave-side snacks from Krem Chympe's own kitchen, or have city restaurants deliver straight to your camp — before you trek, during your stay, or after the cave.",
  announcement: "Now delivering to Krem Chympe basecamp &amp; Chympe Waterfall campsite · Pre-order for your trek date",
  superAdminWhatsApp: "911234567890", // Super Admin's WhatsApp, country code, no + or spaces
  currency: "₹",
  deliveryCharge: 40,
  freeDeliveryAbove: 799,
  banners: [
    {
      title: "The Weekend Table",
      subtitle: "Curated tasting menus from our finest partner kitchens",
      cta: "Explore Menus",
      image: "assets/food/banner-1.jpg",
    },
    {
      title: "First Order Privilege",
      subtitle: "15% off your first order, on the house",
      cta: "Order Now",
      image: "assets/food/banner-2.jpg",
    },
  ],
};

// ---------------------------------------------------------------------------
// CATEGORIES — shown as the browsable pills/cards on the homepage. Mixes
// Krem Chympe's own on-site menu categories with general delivery cuisines.
// Editable live from admin.html > Categories once Firebase is connected.
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { id: "trail-packs", name: "Trail Packs", icon: "fa-person-hiking" },
  { id: "camp-meals", name: "Camping Meals", icon: "fa-campground" },
  { id: "bamboo-specialties", name: "Bamboo Specialties", icon: "fa-seedling" },
  { id: "post-trek-refuel", name: "Post-Trek Refuel", icon: "fa-mug-hot" },
  { id: "north-indian", name: "North Indian", icon: "fa-fire" },
  { id: "biryani", name: "Biryani", icon: "fa-bowl-rice" },
  { id: "cafe", name: "Café & Continental", icon: "fa-mug-saucer" },
  { id: "desserts", name: "Desserts", icon: "fa-ice-cream" },
];

// ---------------------------------------------------------------------------
// RESTAURANTS — sample data so the site works out of the box in LOCAL MODE.
// Once Firebase is connected, this array is replaced live from the
// database on load, and this file is never edited by hand again.
// ---------------------------------------------------------------------------
const RESTAURANTS = [
  {
    id: "krem-chympe-kitchen",
    status: "approved",
    pinned: true,
    featured: true,
    name: "Krem Chympe Kitchen",
    ownerName: "David Tariang",
    logo: "assets/restaurants/krem-chympe-logo.jpg",
    cover: "assets/restaurants/krem-chympe-cover.jpg",
    gallery: ["assets/restaurants/krem-chympe-1.jpg", "assets/restaurants/krem-chympe-2.jpg"],
    cuisine: ["Khasi", "Camp Kitchen"],
    description:
      "Cooked right at basecamp by our own guides and local cooks — trail packs for the trek in, hot meals waiting after the cave, and campfire dinners under the stars. Pre-order and it'll be ready when you arrive.",
    rating: 4.9,
    reviewCount: 214,
    priceForTwo: 500,
    openingHours: "06:00 AM",
    closingHours: "09:00 PM",
    phone: "911234567890",
    whatsapp: "911234567890",
    address: "Krem Chympe Basecamp, Brichyrnot Village, East Jaintia Hills",
    googleMapsLink: "https://maps.google.com/?q=Krem+Chympe",
    upiName: "Krem Chympe Kitchen",
    upiId: "kremchympe@upi",
    qrCode: "assets/restaurants/krem-chympe-qr.png",
    createdAt: "2026-01-01",
    categories: ["trail-packs", "camp-meals", "bamboo-specialties", "post-trek-refuel"],
    offers: [{ label: "Free herbal tea with any trail pack", code: "TRAILTEA" }],
    menu: [
      { id: "kc-1", name: "Trekker's Trail Pack", description: "Packed rice, boiled egg, local greens, and jhur — built to travel and refuel mid-trek.", category: "Trail Packs", image: "assets/food/trail-pack.jpg", veg: false, price: 180, discountPrice: null, available: true, todaysSpecial: true, popular: true },
      { id: "kc-2", name: "Bamboo Chicken", description: "Chicken slow-cooked inside a bamboo shoot over open fire, Khasi style.", category: "Bamboo Specialties", image: "assets/food/bamboo-chicken.jpg", veg: false, price: 320, discountPrice: null, available: true, todaysSpecial: false, popular: true },
      { id: "kc-3", name: "Bamboo Shoot Rice", description: "Steamed rice with fermented bamboo shoot and local herbs, cooked in bamboo.", category: "Bamboo Specialties", image: "assets/food/bamboo-rice.jpg", veg: true, price: 220, discountPrice: null, available: true, todaysSpecial: false, popular: false },
      { id: "kc-4", name: "Campfire Dinner Thali", description: "Rice, dal, seasonal vegetables, and a smoky pork or veg curry — served hot at your tent.", category: "Camping Meals", image: "assets/food/campfire-thali.jpg", veg: false, price: 280, discountPrice: null, available: true, todaysSpecial: false, popular: true },
      { id: "kc-5", name: "Post-Trek Ginger Tea", description: "Hot local ginger-lemon tea, waiting for you at the cave exit.", category: "Post-Trek Refuel", image: "assets/food/ginger-tea.jpg", veg: true, price: 40, discountPrice: null, available: true, todaysSpecial: false, popular: true },
    ],
  },
  {
    id: "the-copper-tandoor",
    status: "approved",
    pinned: true,
    featured: true,
    name: "The Copper Tandoor",
    ownerName: "Ravi Mehta",
    logo: "assets/restaurants/copper-tandoor-logo.jpg",
    cover: "assets/restaurants/copper-tandoor-cover.jpg",
    gallery: [
      "assets/restaurants/copper-tandoor-1.jpg",
      "assets/restaurants/copper-tandoor-2.jpg",
      "assets/restaurants/copper-tandoor-3.jpg",
    ],
    cuisine: ["North Indian", "Mughlai"],
    description:
      "A legacy tandoor kitchen serving slow-marinated meats and buttery gravies since 1998. Every dish is finished over live charcoal.",
    rating: 4.8,
    reviewCount: 1284,
    priceForTwo: 900,
    openingHours: "11:00 AM",
    closingHours: "11:30 PM",
    phone: "919876500001",
    whatsapp: "919876500001",
    address: "12 Residency Road, City Centre",
    googleMapsLink: "https://maps.google.com/?q=Residency+Road",
    upiName: "The Copper Tandoor",
    upiId: "coppertandoor@upi",
    qrCode: "assets/restaurants/copper-tandoor-qr.png",
    createdAt: "2026-01-05",
    categories: ["north-indian", "biryani"],
    offers: [{ label: "20% OFF above ₹599", code: "TANDOOR20" }],
    menu: [
      { id: "ct-1", name: "Butter Chicken", description: "Char-grilled chicken simmered in a velvety tomato-butter gravy.", category: "Mains", image: "assets/food/butter-chicken.jpg", veg: false, price: 380, discountPrice: 340, available: true, todaysSpecial: true, popular: true },
      { id: "ct-2", name: "Paneer Tikka Lababdar", description: "Smoked cottage cheese in a rich cashew and tomato sauce.", category: "Mains", image: "assets/food/paneer-lababdar.jpg", veg: true, price: 340, discountPrice: null, available: true, todaysSpecial: false, popular: true },
      { id: "ct-3", name: "Seekh Kebab", description: "Hand-minced lamb, skewered and smoked over coal.", category: "Starters", image: "assets/food/seekh-kebab.jpg", veg: false, price: 320, discountPrice: null, available: true, todaysSpecial: false, popular: false },
      { id: "ct-4", name: "Lucknowi Dum Biryani", description: "Long-grain basmati layered with saffron and slow-cooked mutton.", category: "Biryani", image: "assets/food/dum-biryani.jpg", veg: false, price: 420, discountPrice: null, available: true, todaysSpecial: false, popular: true },
      { id: "ct-5", name: "Garlic Naan", description: "Tandoor-baked flatbread, brushed with garlic butter.", category: "Breads", image: "assets/food/garlic-naan.jpg", veg: true, price: 90, discountPrice: null, available: true, todaysSpecial: false, popular: false },
    ],
  },
  {
    id: "bella-vista",
    status: "approved",
    pinned: false,
    featured: true,
    name: "Bella Vista",
    ownerName: "Marco Rossi",
    logo: "assets/restaurants/bella-vista-logo.jpg",
    cover: "assets/restaurants/bella-vista-cover.jpg",
    gallery: ["assets/restaurants/bella-vista-1.jpg", "assets/restaurants/bella-vista-2.jpg"],
    cuisine: ["Italian", "Continental"],
    description: "Wood-fired pizza and hand-rolled pasta, made the way it's been made in Naples for generations.",
    rating: 4.6,
    reviewCount: 842,
    priceForTwo: 1100,
    openingHours: "12:00 PM",
    closingHours: "11:00 PM",
    phone: "919876500002",
    whatsapp: "919876500002",
    address: "44 Lakeview Avenue",
    googleMapsLink: "https://maps.google.com/?q=Lakeview+Avenue",
    upiName: "Bella Vista Ristorante",
    upiId: "bellavista@upi",
    qrCode: "assets/restaurants/bella-vista-qr.png",
    createdAt: "2026-02-14",
    categories: ["italian", "cafe"],
    offers: [{ label: "Free garlic bread above ₹899", code: "BREAD" }],
    menu: [
      { id: "bv-1", name: "Margherita Pizza", description: "San Marzano tomato, fior di latte, basil, wood-fired crust.", category: "Pizza", image: "assets/food/margherita.jpg", veg: true, price: 450, discountPrice: null, available: true, todaysSpecial: false, popular: true },
      { id: "bv-2", name: "Truffle Mushroom Risotto", description: "Arborio rice, wild mushrooms, shaved parmesan, truffle oil.", category: "Mains", image: "assets/food/risotto.jpg", veg: true, price: 560, discountPrice: null, available: true, todaysSpecial: true, popular: false },
      { id: "bv-3", name: "Spaghetti alle Vongole", description: "Clams, white wine, garlic, chilli, parsley.", category: "Mains", image: "assets/food/vongole.jpg", veg: false, price: 620, discountPrice: null, available: true, todaysSpecial: false, popular: false },
      { id: "bv-4", name: "Tiramisu", description: "Espresso-soaked ladyfingers, mascarpone, cocoa.", category: "Desserts", image: "assets/food/tiramisu.jpg", veg: true, price: 280, discountPrice: null, available: true, todaysSpecial: false, popular: true },
    ],
  },
  {
    id: "sakura-house",
    status: "approved",
    pinned: true,
    featured: false,
    name: "Sakura House",
    ownerName: "Kenji Watanabe",
    logo: "assets/restaurants/sakura-logo.jpg",
    cover: "assets/restaurants/sakura-cover.jpg",
    gallery: ["assets/restaurants/sakura-1.jpg", "assets/restaurants/sakura-2.jpg"],
    cuisine: ["Japanese", "Sushi"],
    description: "Precision sushi and ramen from a kitchen trained in Tokyo's Tsukiji tradition.",
    rating: 4.9,
    reviewCount: 611,
    priceForTwo: 1400,
    openingHours: "12:30 PM",
    closingHours: "10:30 PM",
    phone: "919876500003",
    whatsapp: "919876500003",
    address: "7 Harbour Street",
    googleMapsLink: "https://maps.google.com/?q=Harbour+Street",
    upiName: "Sakura House",
    upiId: "sakurahouse@upi",
    qrCode: "assets/restaurants/sakura-qr.png",
    createdAt: "2026-03-01",
    categories: ["japanese", "healthy"],
    offers: [],
    menu: [
      { id: "sh-1", name: "Salmon Nigiri (6pc)", description: "Norwegian salmon, hand-pressed sushi rice.", category: "Sushi", image: "assets/food/nigiri.jpg", veg: false, price: 480, discountPrice: null, available: true, todaysSpecial: false, popular: true },
      { id: "sh-2", name: "Tonkotsu Ramen", description: "18-hour pork bone broth, chashu, ajitama egg, scallion.", category: "Ramen", image: "assets/food/ramen.jpg", veg: false, price: 520, discountPrice: null, available: true, todaysSpecial: true, popular: true },
      { id: "sh-3", name: "Vegetable Gyoza", description: "Pan-seared dumplings, cabbage and mushroom filling.", category: "Starters", image: "assets/food/gyoza.jpg", veg: true, price: 310, discountPrice: null, available: true, todaysSpecial: false, popular: false },
    ],
  },
  {
    id: "green-bowl-co",
    status: "approved",
    pinned: false,
    featured: false,
    name: "Green Bowl Co.",
    ownerName: "Anaya Kapoor",
    logo: "assets/restaurants/green-bowl-logo.jpg",
    cover: "assets/restaurants/green-bowl-cover.jpg",
    gallery: ["assets/restaurants/green-bowl-1.jpg"],
    cuisine: ["Healthy", "Salads"],
    description: "Cold-pressed, protein-forward bowls for people who eat well without slowing down.",
    rating: 4.4,
    reviewCount: 298,
    priceForTwo: 650,
    openingHours: "08:00 AM",
    closingHours: "09:00 PM",
    phone: "919876500004",
    whatsapp: "919876500004",
    address: "19 Fitness District",
    googleMapsLink: "https://maps.google.com/?q=Fitness+District",
    upiName: "Green Bowl Co",
    upiId: "greenbowl@upi",
    qrCode: "assets/restaurants/green-bowl-qr.png",
    createdAt: "2026-04-20",
    categories: ["healthy"],
    offers: [{ label: "10% OFF for first order", code: "FRESH10" }],
    menu: [
      { id: "gb-1", name: "Quinoa Protein Bowl", description: "Quinoa, grilled chicken, avocado, roasted chickpeas, tahini.", category: "Bowls", image: "assets/food/quinoa-bowl.jpg", veg: false, price: 380, discountPrice: null, available: true, todaysSpecial: false, popular: true },
      { id: "gb-2", name: "Vegan Buddha Bowl", description: "Roasted vegetables, brown rice, hummus, tahini dressing.", category: "Bowls", image: "assets/food/buddha-bowl.jpg", veg: true, price: 340, discountPrice: null, available: true, todaysSpecial: false, popular: false },
    ],
  },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function slugify(str) {
  return (
    (str || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "restaurant"
  );
}

function compressImageToDataURL(file, maxDim = 1080, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(""); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/* =========================================================================
   DataStore — every page reads through this. In LOCAL MODE it's a thin
   wrapper over the arrays above. In LIVE MODE (Firebase connected) it also
   keeps those same arrays in sync with the database in real time, so
   existing page code (home.js, restaurant.js, search.js, ...) never has to
   know the difference.
   ========================================================================= */
const DataStore = {
  isLive: false,
  ready: null,
  _rtdb: null,
  _auth: null,

  init() {
    this.ready = new Promise((resolve) => {
      const cfg = FIREBASE_CONFIG;
      const configured = cfg && cfg.apiKey && !String(cfg.apiKey).startsWith("YOUR_");
      if (!configured || typeof firebase === "undefined") {
        this.isLive = false;
        resolve();
        return;
      }
      try {
        firebase.initializeApp(cfg);
        this._rtdb = firebase.database();
        this._auth = firebase.auth();
        this.isLive = true;

        let firstLoad = true;
        const finishFirstLoad = () => {
          if (firstLoad) { firstLoad = false; resolve(); }
        };

        const rref = this._rtdb.ref("luxeeats/restaurants");
        rref.on(
          "value",
          (snap) => {
            const val = snap.val();
            if (val === null) {
              const seed = {};
              RESTAURANTS.forEach((r) => (seed[r.id] = r));
              rref.set(seed);
            } else {
              RESTAURANTS.length = 0;
              Object.values(val).forEach((r) => RESTAURANTS.push(r));
            }
            finishFirstLoad();
            window.dispatchEvent(new CustomEvent("luxeeats:data-updated"));
          },
          (err) => {
            console.warn("Luxe Eats: Firebase read failed, using local sample data.", err);
            this.isLive = false;
            finishFirstLoad();
          }
        );

        const cref = this._rtdb.ref("luxeeats/siteConfig");
        cref.on("value", (snap) => {
          const val = snap.val();
          if (val === null) cref.set(SITE_CONFIG);
          else Object.assign(SITE_CONFIG, val);
          window.dispatchEvent(new CustomEvent("luxeeats:data-updated"));
        });

        const catref = this._rtdb.ref("luxeeats/categories");
        catref.on("value", (snap) => {
          const val = snap.val();
          if (val === null) {
            const seed = {};
            CATEGORIES.forEach((c) => (seed[c.id] = c));
            catref.set(seed);
          } else {
            CATEGORIES.length = 0;
            Object.values(val).forEach((c) => CATEGORIES.push(c));
          }
          window.dispatchEvent(new CustomEvent("luxeeats:data-updated"));
        });

        // never block the site for more than 4s if Firebase is unreachable
        setTimeout(finishFirstLoad, 4000);
      } catch (e) {
        console.warn("Luxe Eats: Firebase init failed, using local sample data.", e);
        this.isLive = false;
        resolve();
      }
    });
  },

  // ---- reads (unchanged across pages) ----
  getVisibleRestaurants() {
    return RESTAURANTS.filter((r) => r.status === "approved");
  },
  getRestaurantById(id) {
    return RESTAURANTS.find((r) => r.id === id);
  },
  getFeatured() {
    return this.getVisibleRestaurants().filter((r) => r.featured);
  },
  getPinned() {
    return this.getVisibleRestaurants().filter((r) => r.pinned);
  },
  getNewest(limit = 8) {
    return [...this.getVisibleRestaurants()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
  },
  getPopular(limit = 8) {
    return [...this.getVisibleRestaurants()].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, limit);
  },
  getTrendingFoods(limit = 8) {
    const items = [];
    this.getVisibleRestaurants().forEach((r) => {
      r.menu.filter((m) => m.popular).forEach((m) => items.push({ ...m, restaurantId: r.id, restaurantName: r.name }));
    });
    return items.slice(0, limit);
  },
  searchRestaurants(query) {
    const q = query.trim().toLowerCase();
    if (!q) return this.getVisibleRestaurants();
    return this.getVisibleRestaurants().filter((r) => {
      const haystack = [r.name, ...r.cuisine, r.description].join(" ").toLowerCase();
      const menuMatch = r.menu.some((m) => m.name.toLowerCase().includes(q));
      return haystack.includes(q) || menuMatch;
    });
  },

  // ---- admin writes: super admin dashboard CRUD (Firebase live, or local-only fallback) ----
  saveRestaurant(id, obj) {
    if (this.isLive) return this._rtdb.ref(`luxeeats/restaurants/${id}`).set(obj);
    const i = RESTAURANTS.findIndex((r) => r.id === id);
    if (i >= 0) RESTAURANTS[i] = obj; else RESTAURANTS.push(obj);
    return Promise.resolve();
  },
  updateRestaurant(id, patch) {
    if (this.isLive) return this._rtdb.ref(`luxeeats/restaurants/${id}`).update(patch);
    const r = this.getRestaurantById(id);
    if (r) Object.assign(r, patch);
    return Promise.resolve();
  },
  deleteRestaurant(id) {
    if (this.isLive) return this._rtdb.ref(`luxeeats/restaurants/${id}`).remove();
    const i = RESTAURANTS.findIndex((r) => r.id === id);
    if (i >= 0) RESTAURANTS.splice(i, 1);
    return Promise.resolve();
  },
  updateSiteConfig(patch) {
    Object.assign(SITE_CONFIG, patch);
    if (this.isLive) return this._rtdb.ref("luxeeats/siteConfig").update(patch);
    return Promise.resolve();
  },
  saveCategories(list) {
    CATEGORIES.length = 0;
    list.forEach((c) => CATEGORIES.push(c));
    if (this.isLive) {
      const obj = {};
      list.forEach((c) => (obj[c.id] = c));
      return this._rtdb.ref("luxeeats/categories").set(obj);
    }
    return Promise.resolve();
  },

  // ---- public restaurant registration (register.html) -> pending review ----
  submitRegistration(obj) {
    if (this.isLive) return this._rtdb.ref("luxeeats/registrations").push(obj);
    return Promise.resolve({ key: "local-" + Date.now() });
  },
  listenRegistrations(cb) {
    if (!this.isLive) { cb({}); return () => {}; }
    const ref = this._rtdb.ref("luxeeats/registrations");
    const handler = (snap) => cb(snap.val() || {});
    ref.on("value", handler, () => cb({}));
    return () => ref.off("value", handler);
  },
  approveRegistration(regId, restaurantObj) {
    if (!this.isLive) return Promise.resolve();
    const updates = {};
    updates[`luxeeats/restaurants/${restaurantObj.id}`] = restaurantObj;
    updates[`luxeeats/registrations/${regId}`] = null;
    return this._rtdb.ref().update(updates);
  },
  rejectRegistration(regId) {
    if (!this.isLive) return Promise.resolve();
    return this._rtdb.ref(`luxeeats/registrations/${regId}`).remove();
  },

  // ---- auth ----
  signIn(email, password) {
    if (!this.isLive) return Promise.reject(new Error("Firebase isn't connected yet — see README setup steps."));
    return this._auth.signInWithEmailAndPassword(email, password);
  },
  signOut() {
    if (this._auth) return this._auth.signOut();
    return Promise.resolve();
  },
  onAuthChange(cb) {
    if (!this.isLive) { cb(null); return; }
    this._auth.onAuthStateChanged(cb);
  },
};

DataStore.init();
