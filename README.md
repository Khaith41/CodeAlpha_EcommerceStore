# CodeAlpha_EcommerceStore (Task 1: Simple E-Commerce Store)

> **CodeAlpha Full Stack Development Internship — Task 1**  
> 🔗 **Live Demo (Open on any device):** [https://khaith41.github.io/CodeAlpha_EcommerceStore/](https://khaith41.github.io/CodeAlpha_EcommerceStore/)

---

## 📱 Cross-Device & Responsive Support
This application is fully responsive and optimized for evaluation on any device:
- **Mobile Phones (Android & iOS):** Touch-friendly drawer, responsive product grid, mobile nav.
- **Tablets & iPads:** Fluid layout adapting to portrait and landscape orientations.
- **Laptops & Desktop PCs:** High-resolution widescreen layouts with interactive modals.

---

## ✨ Features Implemented
- **Product Listings & Category Filters**: Filter electronics by `Audio`, `Wearables`, `Accessories`, and `Photography` or search in real time.
- **Product Details Page / Modal**: Click any item to view high-resolution photos, detailed specs, ratings, and stock availability.
- **Interactive Shopping Cart**: Add items, increase/decrease quantities, calculate real-time totals, and view a dynamic badge counter.
- **User Registration & Login**: Full auth modal supporting account creation, sign-in, and profile state retention.
- **Order Processing & History**: Checkout drawer that validates delivery details, processes orders, updates stock, and saves order receipts to Order History.
- **Hybrid Storage & Auto-Fallback**: Automatically syncs with Express.js REST API when running on a server, and gracefully uses browser `localStorage` when hosted on GitHub Pages or opened standalone.

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (CSS Grid & Flexbox, Dark Modern Theme), Vanilla JavaScript ES6+
- **Backend**: Node.js & Express.js (`server.js`)
- **Database**: Persistent JSON Store (`database.json`) for Products, Users, and Orders
- **Hosting**: GitHub Pages (Live Demo) & Express.js REST API

---

## 🚀 How Evaluators Can Test This Project

### Method 1: Instant Live Evaluation (No Installation Needed)
Click the live link on any smartphone, tablet, or PC:  
👉 **[https://khaith41.github.io/CodeAlpha_EcommerceStore/](https://khaith41.github.io/CodeAlpha_EcommerceStore/)**

### Method 2: Local Full-Stack with Node.js
```bash
git clone https://github.com/Khaith41/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
npm install
npm start
```
Then visit `http://localhost:3000` in your web browser.
