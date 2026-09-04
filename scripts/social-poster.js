#!/usr/bin/env node
/*
 * Auto cross-poster for M Ashraf Shoes.
 *
 * Reads products.js, and for any product that has not been posted yet
 * (or a specific product id passed as argv[2], or ALL new ones on manual
 * runs), publishes it to Facebook (Page post), Instagram (photo post) and
 * Pinterest (pin), each with a caption built from the product data plus a
 * link back to the product page on mashrafshoes.store.
 *
 * It is DORMANT until the owner adds the access tokens as env vars / GitHub
 * Secrets. With no tokens set (or with DRY_RUN=1) it only prints what it
 * WOULD post and exits 0.
 *
 * Required env vars (add as GitHub repo Secrets):
 *   FB_PAGE_ID              Facebook Page id
 *   FB_PAGE_ACCESS_TOKEN    long-lived Page access token
 *   IG_USER_ID              Instagram Business account id (numeric)
 *   IG_ACCESS_TOKEN         long-lived token with instagram_content_publish
 *   PINTEREST_ACCESS_TOKEN  Pinterest v5 token (pins:read, pins:write)
 *   PINTEREST_BOARD_ID      board id to pin to
 * Optional:
 *   SITE_BASE_URL           default https://mashrafshoes.store
 *   DRY_RUN                 1 = print only, never call the APIs
 *
 * Usage:
 *   node scripts/social-poster.js            # post all products not yet posted
 *   node scripts/social-poster.js 7          # (re)post product id 7
 *   DRY_RUN=1 node scripts/social-poster.js  # preview everything
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = (process.env.SITE_BASE_URL || 'https://mashrafshoes.store').replace(/\/+$/, '');
const DRY = process.env.DRY_RUN === '1';
const STATE_FILE = path.join(__dirname, '..', '.github', 'social-state.json');

const HASHTAGS = {
  khussa: ['#Khussa', '#PakistaniKhussa', '#HandmadeShoes', '#KhussaLover'],
  chappal: ['#Chappal', '#LeatherChappal', '#PakistaniChappal'],
  sandal: ['#Sandals', '#SummerSandals'],
  slipper: ['#Slippers', '#ComfortSlippers', '#HomeSlippers'],
  loafer: ['#Loafers', '#FormalShoes', '#MenFashion'],
  bridal: ['#BridalSandals', '#WeddingShoes', '#EidShoes'],
  kids: ['#KidsShoes', '#KidsKhussa', '#BabyShoes'],
};

function loadProducts() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'products.js'), 'utf8');
  const window = {};
  const sandbox = { window, console };
  sandbox.window.products = undefined;
  vm.createContext(sandbox);
  vm.runInContext(src + '\n;this.__products = window.products || products;', sandbox);
  return sandbox.__products;
}

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch (e) { return {}; }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
}

function absUrl(p) {
  return SITE + '/' + p.split('/').map(encodeURIComponent).join('/');
}

function pickImage(p) {
  const imgs = (p.variants && p.variants[0] && p.variants[0].images) || [];
  return imgs.length ? imgs[0] : null;
}

function tagsFor(p) {
  const hay = (p.name + ' ' + (p.category || '')).toLowerCase();
  const set = new Set(['#Shoes', '#Pakistan', '#CashOnDelivery']);
  for (const k of Object.keys(HASHTAGS)) {
    if (hay.includes(k)) HASHTAGS[k].forEach((t) => set.add(t));
  }
  return [...set];
}

function buildCopy(p) {
  const price = 'PKR ' + (p.price ? p.price.toLocaleString('en-PK') : '');
  const img = pickImage(p);
  const imgUrl = img ? absUrl(img) : null;
  const pageUrl = SITE + '/' + (p.pageUrl || '');
  const sizeLine = p.variants && p.variants[0] && p.variants[0].sizes && p.variants[0].sizes.length
    ? 'Available sizes: ' + Math.min(...p.variants[0].sizes) + ' - ' + Math.max(...p.variants[0].sizes)
    : '';
  const caption = [
    p.name,
    price,
    '',
    'Order online with Cash on Delivery anywhere in Pakistan.',
    pageUrl,
    sizeLine ? sizeLine + '.' : '',
    tagsFor(p).join(' '),
  ].filter(Boolean).join('\n');
  return { imgUrl, pageUrl, caption };
}

function postFacebook(pageId, token, copy) {
  const body = new URLSearchParams({
    message: copy.caption,
    link: copy.pageUrl,
    access_token: token,
  });
  return fetch('https://graph.facebook.com/v19.0/' + pageId + '/feed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  }).then((r) => r.json().then((j) => ({ status: r.status, json: j })));
}

async function postInstagram(userId, token, copy) {
  if (!copy.imgUrl) return { status: 0, json: { error: { message: 'no image available' } } };
  const container = await fetch('https://graph.facebook.com/v19.0/' + userId + '/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      image_url: copy.imgUrl,
      caption: copy.caption,
      access_token: token,
    }).toString(),
  }).then((r) => r.json());
  if (!container.id) return { status: 400, json: container };
  const published = await fetch('https://graph.facebook.com/v19.0/' + userId + '/media_publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: container.id, access_token: token }).toString(),
  }).then((r) => r.json());
  return { status: published.id ? 200 : 400, json: published };
}

function postPinterest(token, boardId, copy) {
  if (!copy.imgUrl) return Promise.resolve({ status: 0, json: { error: { message: 'no image available' } } });
  return fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      board_id: boardId,
      media_source: { source_type: 'image_url', url: copy.imgUrl },
      link: copy.pageUrl,
      title: copy.caption.split('\n')[0],
      description: copy.caption,
    }),
  }).then((r) => r.json().then((j) => ({ status: r.status, json: j })));
}

async function waitForImages(products) {
  const targets = [];
  for (const p of products) {
    const img = pickImage(p);
    if (img) targets.push(absUrl(img));
  }
  for (let i = 0; i < 30; i++) {
    const results = await Promise.all(targets.map((u) =>
      fetch(u, { method: 'HEAD' }).then((r) => r.status === 200).catch(() => false)));
    if (results.every(Boolean)) { console.log('all product images live:', targets.length); return; }
    const missing = targets.filter((_, idx) => !results[idx]);
    console.log('waiting for images to go live (' + missing.length + ' pending)...');
    await new Promise((r) => setTimeout(r, 10000));
  }
  console.warn('gave up waiting for product images to go live');
}

async function main() {
  const products = loadProducts();

  if (process.argv[2] === '--wait-images') {
    await waitForImages(products);
    process.exit(0);
  }

  const state = loadState();
  const posted = state.posted || {};
  const onlyId = process.argv[2] ? parseInt(process.argv[2], 10) : null;

  const haveFb = Boolean(process.env.FB_PAGE_ID && process.env.FB_PAGE_ACCESS_TOKEN);
  const haveIg = Boolean(process.env.IG_USER_ID && process.env.IG_ACCESS_TOKEN);
  const havePin = Boolean(process.env.PINTEREST_ACCESS_TOKEN && process.env.PINTEREST_BOARD_ID);
  const anyToken = haveFb || haveIg || havePin;

  if (!anyToken) {
    console.log('social-poster: no platform tokens configured (add GitHub Secrets) — previewing all new products.');
  }

  const results = [];
  const preview = !anyToken || DRY;
  for (const p of products) {
    const id = String(p.id);
    if (onlyId !== null && onlyId !== p.id) continue;
    const already = posted[id] || {};
    const wantFb = onlyId !== null || !already.fb;
    const wantIg = onlyId !== null || !already.ig;
    const wantPin = onlyId !== null || !already.pin;

    const copy = buildCopy(p);
    results.push({ id, name: p.name });

    if (preview) {
      console.log('---- WOULD POST product ' + id + ': ' + p.name);
      console.log('  image : ' + copy.imgUrl);
      console.log('  link  : ' + copy.pageUrl);
      console.log('  caption:\n' + copy.caption.split('\n').map((l) => '    ' + l).join('\n'));
      continue;
    }

    const doFb = haveFb && wantFb;
    const doIg = haveIg && wantIg;
    const doPin = havePin && wantPin;
    if (!doFb && !doIg && !doPin) {
      if (onlyId === null) continue;
      console.log('product ' + id + ' already posted everywhere (use a fresh id or clear .github/social-state.json to repost).');
      continue;
    }

    if (doFb) {
      const fb = await postFacebook(process.env.FB_PAGE_ID, process.env.FB_PAGE_ACCESS_TOKEN, copy);
      console.log('  FB post status ' + fb.status + ' ' + JSON.stringify(fb.json));
      if (fb.status === 200) { posted[id] = Object.assign({}, posted[id], { fb: Date.now() }); }
    } else if (haveFb === false && onlyId !== null) {
      console.log('  (facebook token not set — skipped)');
    }
    if (doIg) {
      const ig = await postInstagram(process.env.IG_USER_ID, process.env.IG_ACCESS_TOKEN, copy);
      console.log('  IG post status ' + ig.status + ' ' + JSON.stringify(ig.json));
      if (ig.status === 200) { posted[id] = Object.assign({}, posted[id], { ig: Date.now() }); }
    }
    if (doPin) {
      const pin = await postPinterest(process.env.PINTEREST_ACCESS_TOKEN, process.env.PINTEREST_BOARD_ID, copy);
      console.log('  Pinterest pin status ' + pin.status + ' ' + JSON.stringify(pin.json));
      if (pin.status === 200 || pin.status === 201) { posted[id] = Object.assign({}, posted[id], { pin: Date.now() }); }
    }
  }

  const changed = results.some((r) => posted[String(r.id)]);
  if (anyToken && !DRY && changed) {
    state.posted = posted;
    state.updatedAt = new Date().toISOString();
    saveState(state);
    console.log('post state saved to .github/social-state.json');
  }

  if (!results.length && anyToken) console.log('Nothing new to post.');
  console.log('social-poster done.');
}

main().catch((err) => {
  console.error('social-poster failed:', err.message);
  process.exit(1);
});
