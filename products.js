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
    brand: "Stylo Shoes",
    name: "Diamante Strap Sandals — Maroon",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    image: "images/sandal-maroon.jpeg",
    badge: "New",
    whatsappNumber: "923165856079"
  },
  {
    id: 2,
    brand: "Stylo Shoes",
    name: "Diamante Strap Sandals — Mustard",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    image: "images/sandal-mustard.jpeg",
    badge: "New",
    whatsappNumber: "923165856079"
  },
  {
    id: 3,
    brand: "Stylo Shoes",
    name: "Diamante Strap Sandals — Pink",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    image: "images/sandal-pink.jpeg",
    badge: "New",
    whatsappNumber: "923165856079"
  },
  {
    id: 4,
    brand: "Stylo Shoes",
    name: "Multicolor Beaded Sandals — Pink Sole",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    image: "images/sandal-multicolor-pink.jpeg",
    badge: "New",
    whatsappNumber: "923165856079"
  },
  {
    id: 5,
    brand: "Stylo Shoes",
    name: "Diamante Strap Sandals — Grey",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    image: "images/sandal-grey.jpeg",
    badge: "New",
    whatsappNumber: "923165856079"
  },
  {
    id: 6,
    brand: "Stylo Shoes",
    name: "Diamante Strap Sandals — White",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    image: "images/sandal-white.jpeg",
    badge: "New",
    whatsappNumber: "923165856079"
  },
  {
    id: 7,
    brand: "Stylo Shoes",
    name: "Multicolor Beaded Sandals — Black Sole",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    image: "images/sandal-multicolor-black.jpeg",
    badge: "New",
    whatsappNumber: "923165856079"
  },
  {
    id: 8,
    brand: "Stylo Shoes",
    name: "Silver Strap Sandals — Black Sole",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    sizes: [5],
    image: "images/sandal-silver.jpeg",
    badge: "New",
    whatsappNumber: "923165856079"
  }
];

/* DELIVERY NOTE (shown to customer via WhatsApp message, not on the card):
   - Price above is per pair
   - Advance payment online: Rs. 200 delivery charge
   - Cash on Delivery (COD): Rs. 250 delivery charge
   Update the whatsappNumber field if you ever change your order number.
   Item #8 (Silver) has limited stock — only size 5 available, adjust the
   "sizes" array above once more sizes come in.
*/

/* FIELD NOTES ADDED FOR THIS LAYOUT:
   - brand: shown above the product name (e.g. "M Ashraf") — keep as "M Ashraf" unless you stock other brands
   - rating: number 0-5, one decimal (e.g. 4.6)
   - ratingCount: how many reviews that rating is based on — update as real reviews come in
*/
