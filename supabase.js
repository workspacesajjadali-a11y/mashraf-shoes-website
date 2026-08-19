/* =====================================================================
   M ASHRAF SHOES — SUPABASE CLIENT LIBRARY
   - Loads the supabase-js CDN script on demand (no build step needed).
   - Provides loadProducts(), saveOrder(), saveInquiry(),
     plus Auth: signUp, signIn, signInWithGoogle, signOut, getSession,
     onAuthChange, saveUserCart, loadUserCart, getMyOrders.
   - Everything is a no-op / safe fallback until supabase-config.js
     is filled in with real project credentials.
   ===================================================================== */

(function () {

  const CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

  let client = null;
  let cdnPromise = null;

  function isConfigured() {
    const url = window.SUPABASE_URL || '';
    const key = window.SUPABASE_ANON_KEY || '';
    return !/YOUR-PROJECT|YOUR-ANON/i.test(url + key);
  }

  function loadCdn() {
    if (window.supabase) return Promise.resolve(window.supabase);
    if (cdnPromise) return cdnPromise;
    cdnPromise = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = CDN;
      s.onload = function () { resolve(window.supabase); };
      s.onerror = function () { reject(new Error('Failed to load supabase-js CDN')); };
      document.head.appendChild(s);
    });
    return cdnPromise;
  }

  async function getClient() {
    if (!isConfigured()) return null;
    if (client) return client;
    try {
      const supabase = await loadCdn();
      client = supabase ? supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;
    } catch (e) {
      client = null;
    }
    return client;
  }

  /* ---------------- AUTH ---------------- */

  async function getSession() {
    const c = await getClient();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    return data ? data.session : null;
  }

  async function getUser() {
    const session = await getSession();
    return session ? session.user : null;
  }

  async function signUp(email, password) {
    const c = await getClient();
    if (!c) return { data: null, error: { message: 'Supabase not configured yet.' } };
    return c.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + '/account.html' } });
  }

  async function signIn(email, password) {
    const c = await getClient();
    if (!c) return { data: null, error: { message: 'Supabase not configured yet.' } };
    return c.auth.signInWithPassword({ email, password });
  }

  async function signInWithGoogle() {
    const c = await getClient();
    if (!c) return { data: null, error: { message: 'Supabase not configured yet.' } };
    return c.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/account.html' }
    });
  }

  async function signOut() {
    const c = await getClient();
    if (!c) return { error: null };
    return c.auth.signOut();
  }

  async function onAuthChange(callback) {
    const c = await getClient();
    if (!c) return function () {};
    const { data } = c.auth.onAuthStateChange(function (event, session) {
      callback(event, session);
    });
    return data.subscription.unsubscribe.bind(data.subscription);
  }

  /* ---------------- USER CART (per-email) ---------------- */

  async function saveUserCart(email, items) {
    const c = await getClient();
    if (!c || !email) return null;
    const { data, error } = await c.rpc('save_cart', {
      p_email: email,
      p_items: items || []
    });
    if (error) throw error;
    return data;
  }

  async function loadUserCart(email) {
    const c = await getClient();
    if (!c || !email) return null;
    const { data, error } = await c.rpc('load_cart', {
      p_email: email
    });
    if (error) throw error;
    return data;
  }

  /* ---------------- MY ORDERS (by email) ---------------- */

  async function getMyOrders(email) {
    const c = await getClient();
    if (!c || !email) return [];
    const { data, error } = await c.rpc('get_my_orders', {
      p_email: email
    });
    if (error) throw error;
    return data || [];
  }

  /* ---------------- PRODUCTS ---------------- */

  async function loadProducts() {
    const c = await getClient();
    if (!c) return null;
    const { data, error } = await c
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data.map(rowToProduct);
  }

  /* Merge the static catalog (products.js) with the database catalog.
     The database wins for the same product id, but any product that only
     exists in products.js is kept — so new products added to the file are
     always visible even before they are synced to Supabase. */
  function mergeProducts(staticProducts, dbProducts) {
    if (!dbProducts || !dbProducts.length) return staticProducts || [];
    const byId = {};
    (staticProducts || []).forEach(function(p){ byId[p.id] = p; });
    dbProducts.forEach(function(p){
      const base = byId[p.id] || {};
      /* The DB row overrides fields it actually has, but we never let it
         wipe out the static pageUrl/images when the DB row lacks them —
         otherwise product cards link to "/undefined?color=..." */
      const merged = {};
      (staticProducts ? Object.keys(base) : []).forEach(function(k){
        merged[k] = base[k];
      });
      Object.keys(p).forEach(function(k){
        const v = p[k];
        if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) return;
        merged[k] = v;
      });
      if (!merged.pageUrl && base.pageUrl) merged.pageUrl = base.pageUrl;
      if (!merged.pageUrl) merged.pageUrl = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
      byId[p.id] = merged;
    });
    return Object.keys(byId)
      .map(function(id){ return byId[id]; })
      .sort(function(a, b){ return a.id - b.id; });
  }

  function rowToProduct(row) {
    const cleanVariants = (row.variants || []).map(function(v){
      return {
        color: v.color,
        sizes: v.sizes || [],
        images: (v.images || []).map(function(img){
          // Some product images were stored with a stray .heic suffix,
          // which browsers cannot display. Normalize to the .jpeg file.
          return img.replace(/\.heic$/i, '');
        })
      };
    });
    return {
      id: row.id,
      brand: row.brand,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      oldPrice: row.old_price == null ? null : Number(row.old_price),
      rating: Number(row.rating || 0),
      ratingCount: Number(row.rating_count || 0),
      badge: row.badge,
      material: row.material,
      whatsappNumber: row.whatsapp_number,
      pageUrl: row.page_url,
      deliveryCharge: row.delivery_charge == null ? 0 : Number(row.delivery_charge),
      description: row.description,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      seoKeywords: row.seo_keywords || [],
      variants: cleanVariants
    };
  }

  /* ---------------- ORDERS ---------------- */

  async function saveOrder(order) {
    const c = await getClient();
    if (!c) return null;
    const { data, error } = await c.rpc('place_order', {
      p_order_id: order.orderId,
      p_name: order.name,
      p_phone: order.phone,
      p_email: order.email,
      p_address: order.address,
      p_items: order.items,
      p_items_text: order.itemsText,
      p_subtotal: order.subtotal,
      p_delivery_charge: order.deliveryCharge,
      p_total: order.total,
      p_payment_method: order.paymentMethod || 'COD'
    });
    if (error) throw error;
    return data;
  }

  /* ---------------- INQUIRIES ---------------- */

  async function saveInquiry(inquiry) {
    const c = await getClient();
    if (!c) return null;
    const { data, error } = await c.rpc('place_inquiry', {
      p_type: inquiry.type,
      p_name: inquiry.name,
      p_phone: inquiry.phone,
      p_message: inquiry.message
    });
    if (error) throw error;
    return data;
  }

  window.SupabaseStore = {
    isConfigured: isConfigured,
    loadCdn: loadCdn,
    getClient: getClient,
    loadProducts: loadProducts,
    mergeProducts: mergeProducts,
    saveOrder: saveOrder,
    saveInquiry: saveInquiry,
    getSession: getSession,
    getUser: getUser,
    signUp: signUp,
    signIn: signIn,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
    onAuthChange: onAuthChange,
    saveUserCart: saveUserCart,
    loadUserCart: loadUserCart,
    getMyOrders: getMyOrders
  };

})();
