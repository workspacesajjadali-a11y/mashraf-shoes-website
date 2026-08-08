/* =====================================================================
   M ASHRAF SHOES — SHARED CART LOGIC
   Used by index.html, product-page.html, cart.html, checkout.html
   Cart is stored in the browser (localStorage) — no account needed.
   ===================================================================== */

function getCart(){
  try{ return JSON.parse(localStorage.getItem('mashraf_cart') || '[]'); }
  catch(e){ return []; }
}

function saveCart(cart){
  localStorage.setItem('mashraf_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, productName, color, size, price, image){
  let cart = getCart();
  const existingIndex = cart.findIndex(item =>
    item.productId === productId && item.color === color && item.size === size
  );
  if(existingIndex > -1){
    cart[existingIndex].qty += 1;
  }else{
    cart.push({ productId, productName, color, size, price, image, qty: 1 });
  }
  saveCart(cart);
}

function removeFromCart(index){
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateQty(index, delta){
  let cart = getCart();
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  saveCart(cart);
}

function cartTotal(){
  return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function cartCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge(){
  const badge = document.getElementById('cartBadge');
  if(badge){
    const count = cartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
