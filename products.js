/* =====================================================================
   M ASHRAF SHOES — PRODUCT DATA

   HOW TO ADD A NEW PRODUCT:
   1. Take a photo with a plain WHITE background
   2. Name the photo file simply, no spaces: e.g. "boot-002.jpg"
   3. Upload it into the /images folder in your GitHub repo
   4. Copy one whole { ... } block below, paste before the closing ]
   5. Change every value for your new product, commit on GitHub
   6. Cloudflare rebuilds automatically — live in under a minute

   PRODUCTS WITH MULTIPLE COLORS:
   Add a new { color, image, sizes } block inside "variants" instead of
   a whole new product. One card, color swatches the customer can click.

   FIELD NOTES:
   - category: exactly "men", "women", or "kids" (lowercase)
   - material: shown on the product page under description
   - sizes: Pakistani local sizing = UK sizing (no conversion needed
     for the number itself — see the size chart built into product-page.html)
   ===================================================================== */

const products = [
  {
    id: 1,
    brand: "Stylo Shoes",
    name: "Diamante Strap Sandals",
    category: "women",
    price: 1300,
    oldPrice: null,
    rating: 4.5,
    ratingCount: 8,
    badge: "New",
    material: "Synthetic (rexine) strap with diamante embellishment, rubber sole",
    whatsappNumber: "923165856079",
    pageUrl: "product-page.html",
    variants: [
      { color: "Maroon", image: "images/diamante-strap-sandals-maroon-pakistan.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Mustard", image: "images/diamante-strap-sandals-mustard-pakistan.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Pink", image: "images/diamante-strap-sandals-pink-pakistan.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Multicolor (Pink Sole)", image: "images/diamante-strap-sandals-multicolor-pink-sole.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Grey", image: "images/diamante-strap-sandals-grey-pakistan.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "White", image: "images/diamante-strap-sandals-white-pakistan.jpeg", sizes: [6,7,8,9,10] },
      { color: "Multicolor (Black Sole)", image: "images/diamante-strap-sandals-multicolor-black-sole.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Silver (Black Sole)", image: "images/diamante-strap-sandals-silver-black-sole.jpeg", sizes: [5] }
    ]
  },
  {
    id: 2,
    brand: "Stylish Shoes",
    name: "Braided Toe-Ring Sandals",
    category: "women",
    price: 999,
    oldPrice: null,
    rating: 4.6,
    ratingCount: 5,
    badge: "New",
    material: "Synthetic (rexine) braided strap with rhinestone embellishment, synthetic sole",
    whatsappNumber: "923165856079",
    pageUrl: "product-braided-sandals.html",
    variants: [
      { color: "Black", image: "images/braided-toe-ring-sandals-black-pakistan.jpeg", sizes: [6,7,9,10] },
      { color: "Maroon", image: "images/braided-toe-ring-sandals-maroon-pakistan.jpeg", sizes: [6,7,9,10] },
      { color: "White", image: "images/braided-toe-ring-sandals-white-pakistan.jpeg", sizes: [6,7,8,9,10] },
      { color: "Red", image: "images/braided-toe-ring-sandals-red-pakistan.jpeg", sizes: [6,7,9,10] }
    ]
  }
];

/* DELIVERY NOTE:
   - Price is per pair
   - Advance payment online: Rs. 200 delivery charge
   - Cash on Delivery (COD): Rs. 250 delivery charge
   - Diamante Strap Sandals: White has size 5 out of stock. Silver (Black Sole): only size 5 in stock.
   - Braided Toe-Ring Sandals: Black/Maroon/Red missing sizes 5 and 8. White has full 6-10 range (also missing size 5).
*/
