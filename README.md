# TrackCart 📦

A zero-friction order tracking web app built for social media vendors (Instagram, WhatsApp, Facebook sellers). No apps to download, no customer accounts, no back-and-forth DMs — just a simple code a customer can check anytime.

## The Problem

Selling through social media DMs means constant "where's my order?" messages. There's no built-in tracking page like Amazon or Shopify offers. Vendors end up manually replying to the same question, over and over.

## The Solution

TrackCart gives every order a unique, readable tracking code. Vendors add orders through a simple dashboard; customers check their status by typing a code into one page — no login, no app, no friction.

## Features

- **Customer order tracking** — enter a code, see live status instantly
- **Vendor sign-up & login** — email/password or Google Sign-In
- **Multi-vendor architecture** — every vendor's data is isolated by store name, all on shared pages
- **Auto-generated tracking codes** (e.g. `TCK-1`, `TCK-2`) — human-readable, not random strings
- **Vendor dashboard** — see your store name and jump straight to adding new orders
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
├── dashboard.html       # Vendor: post-login landing page
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
3. Enter the code — see the order status instantly

### For Vendors
1. Sign up with a store name + email/password (or Google)
2. Land on your dashboard
3. Click "Add Order" — fill in customer name and status
4. Get a generated tracking code (e.g. `TCK-7`) to share with the customer
5. Update the order's status as it progresses

## Data Structure (Firebase Realtime Database)

```
orders/
  TCK-1/
    store: "DemoShop"
    CustomerName: "Jane Doe"
    status: "shipped"

stores/
  DemoShop/
    ownerId: "firebase-auth-uid"
```

- `orders` is looked up directly by code — codes are globally unique across all vendors
- `stores` links a store name to the Firebase Auth account that owns it, used for vendor login

## Local Development

This project has no build step — just open the files with a local server (e.g. VS Code's Live Server extension) since ES modules require `http://` rather than `file://`.

1. Clone the repo
2. Open the folder with Live Server (or any local static server)
3. Firebase config is already wired in `js/app.js` — no `.env` setup needed (Firebase's client-side config is safe to expose publicly)

## Roadmap

- [x] Customer order tracking
- [x] Vendor add-order flow with generated codes
- [x] Vendor sign-up (email/password + Google)
- [x] Vendor login (email/password + Google)
- [x] Vendor dashboard (basic)
- [ ] Real order count + order list on dashboard
- [ ] Product/item field on orders
- [ ] Last-updated timestamps
- [ ] Friendly in-app error messages (currently some errors only show in console)
- [ ] Firebase security rules hardening
- [ ] Mobile device testing pass

## Status

🚧 Actively in development — MVP functional, core vendor and customer flows working end-to-end.
