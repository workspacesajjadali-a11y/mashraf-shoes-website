# Google Login Setup for M Ashraf Shoes

This guide turns ON the **"Continue with Google"** button on the login and signup pages. It takes about 10 minutes. Everything else (login page, signup page, account page, saved cart, order history) already works once you finish this.

---

## What you'll do (3 steps)

1. Create a **Google OAuth Client ID** in Google Cloud Console.
2. Paste it into **Supabase** → Auth → Providers → Google.
3. Add a **Site URL** in Supabase Auth settings.

---

## Step 1 — Create the Google OAuth Client ID

1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. If asked, create a project (any name, e.g. `mashraf-shoes-login`).
3. In the top search bar, type **"OAuth consent screen"** and open it.
4. Click **Create** / get started.
5. Choose **External**, then click **Create**.
6. Fill in:
   - App name: `M Ashraf Shoes`
   - User support email: your email
   - Developer contact email: your email
7. Click **Save and Continue** on the next screens (Scopes → optional, Test users → optional). You can leave them empty.
8. Now open **Credentials** (left menu).
9. Click **+ Create Credentials** → **OAuth client ID**.
10. Choose **Application type: Web application**.
11. Under **Authorized redirect URIs**, click **+ Add URI** and paste:

```
https://atgqtbrhuifogifvqcly.supabase.co/auth/v1/callback
```

12. Click **Create**.
13. A popup shows your **Client ID** and **Client Secret**. Click the copy icon next to each and keep them handy for Step 2.

> If you ever publish the site to your own domain later, you don't need to change anything here — the redirect goes through Supabase, not your domain.

---

## Step 2 — Turn on Google in Supabase

1. Open your Supabase project: https://app.supabase.com/
2. Project: **atgqtbrhuifogifvqcly**
3. Left menu → **Authentication** → **Providers**.
4. Find **Google** and click the toggle to enable it.
5. Paste the **Client ID** and **Client Secret** from Step 1.
6. Click **Save**.

---

## Step 3 — Add the Site URL

1. Supabase → **Authentication** → **URL Configuration**.
2. Under **Site URL**, enter the address where your website is previewed, for example:

```
https://8000-5d05ce03b8b9f7d8.monkeycode-ai.live
```

3. Under **Redirect URLs**, add the same address.
4. Click **Save**.

---

## Done — test it

1. Open the preview of `login.html` or `signup.html`.
2. Click **Continue with Google**.
3. You should be redirected to Google, then back to the site's `account.html` page, logged in.

---

## If Google login doesn't work

- **"redirect_uri_mismatch"** → the Client ID was created with the wrong redirect URI. Re-check Step 1.11 (must be exactly `https://atgqtbrhuifogifvqcly.supabase.co/auth/v1/callback`).
- **"Access blocked / app not verified"** → the consent screen is in testing mode. That's fine: your own Google account works. Anyone you add as a "Test user" in the consent screen can also use it. When you're ready to launch, click **Publish App** on the consent screen page.
- **The button does nothing** → make sure Step 2 (Provider enabled + keys saved) and Step 3 (Site URL) are complete.

---

## What email/password signup needs

Email + password signup works immediately (no Google needed). New customers simply enter an email and a password on the **signup** page. You can optionally require email confirmation — if so, the customer must click the confirmation link before logging in.

## How your account data works

- **Cart** — saved under the customer's email (Supabase `user_carts` table). It follows them on any device.
- **Order history** — shown on the account page, looked up by the email used at checkout.
- **Products** — the same catalog everywhere; the account is only for cart + orders.
