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
    variants: [
      { color: "Maroon", image: "images/sandal-maroon.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Mustard", image: "images/sandal-mustard.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Pink", image: "images/sandal-pink.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Multicolor (Pink Sole)", image: "images/sandal-multicolor-pink.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Grey", image: "images/sandal-grey.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "White", image: "images/sandal-white.jpeg", sizes: [6,7,8,9,10] },
      { color: "Multicolor (Black Sole)", image: "images/sandal-multicolor-black.jpeg", sizes: [5,6,7,8,9,10] },
      { color: "Silver (Black Sole)", image: "images/sandal-silver.jpeg", sizes: [5] }
    ]
  }
];

/* DELIVERY NOTE:
   - Price is per pair
   - Advance payment online: Rs. 200 delivery charge
   - Cash on Delivery (COD): Rs. 250 delivery charge
   - White: size 5 out of stock. Silver (Black Sole): only size 5 in stock.
*/
