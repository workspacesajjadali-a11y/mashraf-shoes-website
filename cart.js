/* =====================================================================
   M ASHRAF SHOES — SHARED CART LOGIC
   Used by index.html, product-page.html, cart.html, checkout.html
   Cart is stored in the browser (localStorage) — no account needed.
   When a user is logged in, the cart is ALSO saved to their email via
   Supabase so it follows them on any device.
   ===================================================================== */

var __cartSyncing = false;

function currentUserEmail(){
  var c = window.SupabaseStore ? window.SupabaseStore.getClient() : null;
  return c ? c.then(function(client){
    if(!client) return null;
    var session = client.auth.getSession();
    return session && session.data && session.data.session && session.data.session.user
      ? session.data.session.user.email : null;
  }) : null;
}

function getCart(){
  try{ return JSON.parse(localStorage.getItem('mashraf_cart') || '[]'); }
  catch(e){ return []; }
}

function saveCart(cart){
  localStorage.setItem('mashraf_cart', JSON.stringify(cart));
  updateCartBadge();
  syncCartToEmail(cart);
}

function syncCartToEmail(cart){
  if(__cartSyncing || !window.SupabaseStore) return;
  var p = currentUserEmail();
  if(!p) return;
  __cartSyncing = true;
  p.then(function(email){
    if(!email){ __cartSyncing = false; return; }
    return window.SupabaseStore.saveUserCart(email, cart)
      .catch(function(err){ console.error('Cart sync to email failed:', err); })
      .then(function(){ __cartSyncing = false; });
  }).catch(function(){ __cartSyncing = false; });
}

/* Pull the user's saved cart from their email once at page load.
   Called from account.html/login flow — safe to call anywhere. */
async function loadCartFromEmail(){
  if(!window.SupabaseStore) return;
  var email = await currentUserEmail();
  if(!email) return;
  try{
    var saved = await window.SupabaseStore.loadUserCart(email);
    if(saved && Array.isArray(saved) && saved.length){
      var local = getCart();
      if(local.length){
        /* keep whichever has more items — avoids losing a filled cart */
        if(local.length >= saved.length){ syncCartToEmail(local); return; }
      }
      localStorage.setItem('mashraf_cart', JSON.stringify(saved));
      updateCartBadge();
    }
  }catch(err){ console.error('Loading cart from email failed:', err); }
}

function addToCart(productId, productName, color, size, price, image, deliveryCharge){
  let cart = getCart();
  const existingIndex = cart.findIndex(item =>
    item.productId === productId && item.color === color && item.size === size
  );
  if(existingIndex > -1){
    cart[existingIndex].qty += 1;
  }else{
    cart.push({
      productId,
      productName,
      color,
      size,
      price,
      image,
      deliveryCharge: Number.isFinite(Number(deliveryCharge)) ? Number(deliveryCharge) : null,
      qty: 1
    });
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

document.addEventListener('DOMContentLoaded', function(){
  updateCartBadge();
  /* Once Supabase loads, pull this user's saved cart from their email. */
  if(window.SupabaseStore && window.SupabaseStore.isConfigured()){
    window.SupabaseStore.getSession().then(function(session){
      if(session && session.user){ loadCartFromEmail(); }
    }).catch(function(){});
  }
});
