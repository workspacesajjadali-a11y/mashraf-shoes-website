/* =====================================================================
   MASHRAF SHOES — PRODUCT DATA

   HOW TO ADD A NEW PRODUCT (do this every time you have a new item):

   1. Take a photo with a plain WHITE background (see tips below)
   2. Name the photo file simply, no spaces: e.g. "boot-002.jpg"
   3. Upload that photo into the /images folder in your GitHub repo
   4. Copy one whole { ... } block below, paste it before the closing ]
   5. Change every value inside it for your new product
   6. Save / commit the change on GitHub
   7. Cloudflare rebuilds the site automatically — live in under a minute

   PHOTO TIPS FOR CLEAN WHITE BACKGROUND:
   - Shoot near a window in daylight, avoid yellow indoor bulbs
   - Place shoe on a plain white sheet of paper or poster board
   - Phone camera is fine — just keep the background fully in frame
   - Free background remover if needed: remove.bg (upload, download, done)

   FIELD NOTES:
   - id: must be unique, just increase the number each time
   - category: must be exactly "men", "women", or "kids" (lowercase)
   - badge: optional small tag like "New" or "Sale" — leave "" for none
   - whatsappNumber: your business WhatsApp, format 92XXXXXXXXXX (no +, no 0)
   ===================================================================== */

const products = [
  {
    id: 1,
    brand: "Mashraf",
    name: "Classic Chukka Boots",
    category: "men",
    price: 4499,
    oldPrice: 5499,
    rating: 4.6,
    ratingCount: 21,
    sizes: [6, 7, 8, 9, 10, 11],
    image: "images/boot-001.jpg",
    badge: "Best Seller",
    whatsappNumber: "923001234567"
  },
  {
    id: 2,
    brand: "Mashraf",
    name: "Everyday Slip-On Sneakers",
    category: "men",
    price: 3299,
    oldPrice: null,
    rating: 4.3,
    ratingCount: 9,
    sizes: [7, 8, 9, 10, 11],
    image: "images/sneaker-001.jpg",
    badge: "New",
    whatsappNumber: "923001234567"
  },
  {
    id: 3,
    brand: "Mashraf",
    name: "Embroidered Khussa",
    category: "women",
    price: 2799,
    oldPrice: 3499,
    rating: 4.8,
    ratingCount: 34,
    sizes: [3, 4, 5, 6, 7, 8],
    image: "images/khussa-001.jpg",
    badge: "Sale",
    whatsappNumber: "923001234567"
  },
  {
    id: 4,
    brand: "Mashraf",
    name: "Comfort Walking Flats",
    category: "women",
    price: 2499,
    oldPrice: null,
    rating: 4.1,
    ratingCount: 6,
    sizes: [3, 4, 5, 6, 7, 8],
    image: "images/flats-001.jpg",
    badge: "",
    whatsappNumber: "923001234567"
  },
  {
    id: 5,
    brand: "Mashraf",
    name: "School Shoes — Velcro",
    category: "kids",
    price: 1899,
    oldPrice: 2299,
    rating: 4.5,
    ratingCount: 17,
    sizes: [10, 11, 12, 13, 1, 2],
    image: "images/kids-001.jpg",
    badge: "Sale",
    whatsappNumber: "923001234567"
  },
  {
    id: 6,
    brand: "Mashraf",
    name: "Kids Light-Up Sneakers",
    category: "kids",
    price: 2199,
    oldPrice: null,
    rating: 4.4,
    ratingCount: 12,
    sizes: [10, 11, 12, 13, 1, 2],
    image: "images/kids-002.jpg",
    badge: "New",
    whatsappNumber: "923001234567"
  }
];

/* FIELD NOTES ADDED FOR THIS LAYOUT:
   - brand: shown above the product name (e.g. "Mashraf") — keep as "Mashraf" unless you stock other brands
   - rating: number 0-5, one decimal (e.g. 4.6)
   - ratingCount: how many reviews that rating is based on — update as real reviews come in
*/
