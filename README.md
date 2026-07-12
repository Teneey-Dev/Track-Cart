# TrackCart 📦

A zero-friction order tracking web app built for social media vendors (Instagram, WhatsApp, Facebook sellers). No apps to download, no customer accounts, no back-and-forth DMs — just a simple code a customer can check anytime.

## The Problem

Selling through social media DMs means constant "where's my order?" messages, and buyers are often skeptical of vendors since fraud is common. Vendors end up manually replying to the same question over and over, with no way to prove they're actively working on an order.

## The Solution

TrackCart gives every order a unique, readable tracking code. Vendors add and update orders through a simple dashboard; customers check status by typing a code into one page — no login, no app, no friction. A visible "last updated" timestamp on every order helps build customer trust that the vendor is actively managing it.

## Features

- **Customer order tracking** — enter a code, see live status and last-updated time instantly
- **Vendor sign-up** — email/password or Google Sign-In
- **Vendor login** — email/password (store name entered manually; see Known Limitations)
- **Multi-vendor architecture** — every vendor's data is isolated by store name, all on shared pages
- **Auto-generated tracking codes** (e.g. `TCK-1`, `TCK-2`) — human-readable, not random strings
- **Rich order data** — customer name, item, price, delivery address, and dispatch rider, not just a status word
- **Vendor dashboard** — view every order for your store, and update its status live from a dropdown
- **Basic Firebase security rules** — only authenticated vendors can write data; anyone can read (needed for anonymous customer tracking)
- **Fully responsive** — mobile-first design, scales up to desktop

## Tech Stack

- **HTML / CSS / JavaScript** — no frameworks, no build step
- **Firebase Realtime Database** — stores orders and store records
- **Firebase Authentication** — email/password and Google Sign-In for vendors

## Project Structure

```
trackcart/
├── index.html          # Landing page + customer order tracking
├── vendor.html         # Vendor sign-up / login
├── add-order.html      # Vendor: add a new order
├── dashboard.html       # Vendor: view & update your orders
├── css/
│   └── styles.css      # All styling, mobile-first with desktop breakpoints
├── js/
│   └── app.js          # All application logic (shared across every page)
└── README.md
```

## How It Works

### For Customers
1. Get a tracking code from a vendor (via DM, receipt, etc.)
2. Go to the TrackCart homepage
3. Enter the code — see the order status and when it was last updated

### For Vendors
1. Sign up with a store name + email/password (or Google)
2. Land on your dashboard
3. Click "Add Order" — fill in customer name, item, price, delivery address, and dispatch rider
4. Get a generated tracking code (e.g. `TCK-7`) to share with the customer
5. Update the order's status directly from the dashboard as it progresses — the change (and timestamp) reflects instantly on the customer's tracking page

## Data Structure (Firebase Realtime Database)

```
orders/
  TCK-1/
    store: "DemoShop"
    customerName: "Jane Doe"
    item: "Gold Chain"
    price: "15000"
    address: "14 Bridge Street, Lagos"
    rider: "Musa"
    status: "packed"
    lastUpdated: 1720598400000

stores/
  DemoShop/
    ownerId: "firebase-auth-uid"
```

- `orders` is looked up directly by code — codes are globally unique across all vendors
- `stores` links a store name to the Firebase Auth account that owns it, used for vendor sign-up

## Security

Basic Firebase Realtime Database rules are in place:

```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": "auth != null"
    },
    "stores": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

Reads are public (required, since customers tracking an order are never logged in). Writes require an authenticated Firebase user, blocking anonymous strangers from writing directly to the database outside the app.

## Known Limitations

- **Login doesn't verify store ownership.** A vendor types their store name at login rather than the app looking up which store their account owns — meaning currently, an authenticated vendor could type any store name and reach that dashboard. Fine for a demo/portfolio stage; would need proper ownership verification before onboarding real, competing vendors.
- **Google Sign-In is available for sign-up only, not login.** Since Google authentication alone can't verify which store an account owns (and login doesn't cross-check the `stores` record), Google login was removed to reduce the surface of the ownership-verification gap above. Vendors who sign up with Google should use email/password to log back in, or reset a password via Firebase if needed.
- **No account linking between sign-in methods.** Signing up with email/password and later using Google (or vice versa) with a different address creates a separate, unlinked account.
- **Some Firebase errors (invalid password, email already in use, etc.) currently surface as raw console errors** rather than friendly in-app messages.

## Local Development

This project has no build step — just open the files with a local server (e.g. VS Code's Live Server extension) since ES modules require `http://` rather than `file://`.

1. Clone the repo
2. Open the folder with Live Server (or any local static server)
3. Firebase config is already wired in `js/app.js` — no `.env` setup needed (Firebase's client-side config is safe to expose publicly)

## Roadmap (Future Ideas)

- [ ] Verify store ownership properly at login (rather than trusting typed input) — would also allow restoring Google login
- [ ] Kanban-style dashboard view (group orders visually by status)
- [ ] Shareable "digital waybill" — a screenshot-friendly order summary vendors can post to Instagram Stories as proof of active shipping
- [ ] Friendly in-app error messages for all Firebase auth errors
- [ ] Store-specific ownership checks in security rules (only the owning vendor can write to their own store's orders)
- [ ] Mobile device testing pass
- [ ] Optional AI-generated, friendlier customer status messages

## Status

✅ **MVP complete** — core vendor and customer flows working end-to-end: sign-up/login, order creation with real data, live status updates, and public order tracking with trust-building timestamps.
