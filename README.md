# CodeAlpha_EcommerceStore (Task 1: Simple E-Commerce Store)

Full-Stack E-Commerce Web Application built for the **CodeAlpha Full Stack Development Internship (Task 1)**.

## ✨ Features Implemented
- **Product Listings & Filtering**: Category pills (`Audio`, `Wearables`, `Accessories`, `Photography`) and real-time search bar.
- **Product Details Page / Modal**: Detailed product view with specifications, ratings, stock count, and instant Add-to-Cart.
- **Shopping Cart**: Live quantity controls (`+` / `-`), item subtotals, and badge counter.
- **User Registration & Login**: Full authentication workflow persisted in the database.
- **Order Processing & Order History**: Checkout form that processes orders, updates stock in `database.json`, and displays past orders.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (`public/index.html`, `public/styles.css`, `public/app.js`)
- **Backend**: Node.js & Express.js (`server.js`)
- **Database**: Persistent JSON Store (`database.json`) for Products, Users, and Orders

## 🚀 How to Run

### Option 1: Run Full-Stack with Node.js & Express
```bash
cd CodeAlpha_EcommerceStore
npm install
npm start
```
Then open `http://localhost:3000` in your browser.

### Option 2: Instant Browser Preview (Zero Setup)
Open `public/index.html` directly in any web browser. The frontend automatically detects if the Express server is offline and falls back to `localStorage` persistence so all features work immediately.
