/* =========================================================================
   LUXE EATS — DATA LAYER
   =========================================================================
   This is the single source of truth for the whole platform. There is no
   backend and no database — the Super Admin "manages" the platform by
   editing this file directly and pushing the change to GitHub.

   HOW TO DO EACH ADMIN ACTION (manual workflow, no backend required):
   - Approve a new restaurant  -> copy the RESTAURANT TEMPLATE below, fill
                                   it in with the details the owner sent via
                                   WhatsApp, paste it into the RESTAURANTS
                                   array, set status: "approved".
   - Reject a restaurant       -> simply don't add it (or set status to
                                   "rejected" and it will never render).
   - Pin / unpin               -> toggle `pinned: true/false`
   - Feature / unfeature       -> toggle `featured: true/false`
   - Suspend                   -> set `status: "suspended"` (hidden from
                                   customers but kept in the file)
   - Remove                    -> delete the object from the array
   - Correct names / spelling  -> edit the string directly
   - Edit categories/offers    -> edit CATEGORIES / SITE_OFFERS below
   - Edit homepage/banners     -> edit SITE_CONFIG below
   ========================================================================= */

// ---------------------------------------------------------------------------
// SITE-WIDE CONFIG — homepage hero, banners, announcement bar, super admin
// contact used for the "Notify Super Admin" WhatsApp message.
// ---------------------------------------------------------------------------
const SITE_CONFIG = {
  siteName: "Luxe Eats",
  tagline: "Fine Food, Delivered Finely",
  heroHeadline: "Extraordinary Meals,",
  heroHeadlineAccent: "Delivered With Grace",
  heroSubtext:
    "A curated table of the city's most distinguished kitchens — from hidden family bistros to celebrated fine dining, delivered to your door.",
  announcement: "Now delivering across the city · Same-day orders accepted",
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
// CATEGORIES — shown as the browsable pills/cards on the homepage
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { id: "north-indian", name: "North Indian", icon: "fa-fire" },
  { id: "italian", name: "Italian", icon: "fa-pizza-slice" },
  { id: "japanese", name: "Japanese", icon: "fa-fish" },
  { id: "desserts", name: "Desserts", icon: "fa-ice-cream" },
  { id: "biryani", name: "Biryani", icon: "fa-bowl-rice" },
  { id: "cafe", name: "Café & Continental", icon: "fa-mug-saucer" },
  { id: "healthy", name: "Healthy Bowls", icon: "fa-leaf" },
  { id: "street-food", name: "Street Food", icon: "fa-drumstick-bite" },
];

// ---------------------------------------------------------------------------
// RESTAURANT TEMPLATE (copy this to add a newly-approved restaurant)
// ---------------------------------------------------------------------------
/*
{
  id: "unique-slug-here",
  status: "approved",          // approved | pending | suspended | rejected
  pinned: false,
  featured: false,
  name: "",
  ownerName: "",
  logo: "assets/restaurants/xxx-logo.jpg",
  cover: "assets/restaurants/xxx-cover.jpg",
  gallery: [],
  cuisine: [],
  description: "",
  rating: 4.5,
  reviewCount: 0,
  priceForTwo: 500,
  openingHours: "10:00 AM",
  closingHours: "11:00 PM",
  phone: "91XXXXXXXXXX",
  whatsapp: "91XXXXXXXXXX",
  address: "",
  googleMapsLink: "",
  upiName: "",
  upiId: "",
  qrCode: "assets/restaurants/xxx-qr.png",
  createdAt: "2026-01-01",
  categories: ["north-indian"],
  offers: [{ label: "20% OFF above ₹499", code: "WELCOME20" }],
  menu: [
    {
      id: "item-1",
      name: "",
      description: "",
      category: "Starters",
      image: "assets/food/xxx.jpg",
      veg: true,
      price: 249,
      discountPrice: null,
      available: true,
      todaysSpecial: false,
      popular: false,
    },
  ],
},
*/

// ---------------------------------------------------------------------------
// RESTAURANTS — sample data so the site works out of the box. Replace with
// real restaurants as they're approved.
// ---------------------------------------------------------------------------
const RESTAURANTS = [
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
      {
        id: "ct-1",
        name: "Butter Chicken",
        description: "Char-grilled chicken simmered in a velvety tomato-butter gravy.",
        category: "Mains",
        image: "assets/food/butter-chicken.jpg",
        veg: false,
        price: 380,
        discountPrice: 340,
        available: true,
        todaysSpecial: true,
        popular: true,
      },
      {
        id: "ct-2",
        name: "Paneer Tikka Lababdar",
        description: "Smoked cottage cheese in a rich cashew and tomato sauce.",
        category: "Mains",
        image: "assets/food/paneer-lababdar.jpg",
        veg: true,
        price: 340,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: true,
      },
      {
        id: "ct-3",
        name: "Seekh Kebab",
        description: "Hand-minced lamb, skewered and smoked over coal.",
        category: "Starters",
        image: "assets/food/seekh-kebab.jpg",
        veg: false,
        price: 320,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: false,
      },
      {
        id: "ct-4",
        name: "Lucknowi Dum Biryani",
        description: "Long-grain basmati layered with saffron and slow-cooked mutton.",
        category: "Biryani",
        image: "assets/food/dum-biryani.jpg",
        veg: false,
        price: 420,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: true,
      },
      {
        id: "ct-5",
        name: "Garlic Naan",
        description: "Tandoor-baked flatbread, brushed with garlic butter.",
        category: "Breads",
        image: "assets/food/garlic-naan.jpg",
        veg: true,
        price: 90,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: false,
      },
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
    description:
      "Wood-fired pizza and hand-rolled pasta, made the way it's been made in Naples for generations.",
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
      {
        id: "bv-1",
        name: "Margherita Pizza",
        description: "San Marzano tomato, fior di latte, basil, wood-fired crust.",
        category: "Pizza",
        image: "assets/food/margherita.jpg",
        veg: true,
        price: 450,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: true,
      },
      {
        id: "bv-2",
        name: "Truffle Mushroom Risotto",
        description: "Arborio rice, wild mushrooms, shaved parmesan, truffle oil.",
        category: "Mains",
        image: "assets/food/risotto.jpg",
        veg: true,
        price: 560,
        discountPrice: null,
        available: true,
        todaysSpecial: true,
        popular: false,
      },
      {
        id: "bv-3",
        name: "Spaghetti alle Vongole",
        description: "Clams, white wine, garlic, chilli, parsley.",
        category: "Mains",
        image: "assets/food/vongole.jpg",
        veg: false,
        price: 620,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: false,
      },
      {
        id: "bv-4",
        name: "Tiramisu",
        description: "Espresso-soaked ladyfingers, mascarpone, cocoa.",
        category: "Desserts",
        image: "assets/food/tiramisu.jpg",
        veg: true,
        price: 280,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: true,
      },
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
      {
        id: "sh-1",
        name: "Salmon Nigiri (6pc)",
        description: "Norwegian salmon, hand-pressed sushi rice.",
        category: "Sushi",
        image: "assets/food/nigiri.jpg",
        veg: false,
        price: 480,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: true,
      },
      {
        id: "sh-2",
        name: "Tonkotsu Ramen",
        description: "18-hour pork bone broth, chashu, ajitama egg, scallion.",
        category: "Ramen",
        image: "assets/food/ramen.jpg",
        veg: false,
        price: 520,
        discountPrice: null,
        available: true,
        todaysSpecial: true,
        popular: true,
      },
      {
        id: "sh-3",
        name: "Vegetable Gyoza",
        description: "Pan-seared dumplings, cabbage and mushroom filling.",
        category: "Starters",
        image: "assets/food/gyoza.jpg",
        veg: true,
        price: 310,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: false,
      },
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
      {
        id: "gb-1",
        name: "Quinoa Protein Bowl",
        description: "Quinoa, grilled chicken, avocado, roasted chickpeas, tahini.",
        category: "Bowls",
        image: "assets/food/quinoa-bowl.jpg",
        veg: false,
        price: 380,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: true,
      },
      {
        id: "gb-2",
        name: "Vegan Buddha Bowl",
        description: "Roasted vegetables, brown rice, hummus, tahini dressing.",
        category: "Bowls",
        image: "assets/food/buddha-bowl.jpg",
        veg: true,
        price: 340,
        discountPrice: null,
        available: true,
        todaysSpecial: false,
        popular: false,
      },
    ],
  },
];

/* =========================================================================
   Helper accessors used across pages
   ========================================================================= */
const DataStore = {
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
    return [...this.getVisibleRestaurants()]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },
  getPopular(limit = 8) {
    return [...this.getVisibleRestaurants()]
      .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
      .slice(0, limit);
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
};
