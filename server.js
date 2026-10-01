const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions to read and write persistent database
function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/products - List all products with optional category/search filter
app.get('/api/products', (req, res) => {
  const db = readDB();
  const { category, search } = req.query;
  let products = db.products;

  if (category && category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  res.json(products);
});

// GET /api/products/:id - Single product details
app.get('/api/products/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST /api/auth/register - User registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const db = readDB();
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: 'u' + Date.now(),
    name,
    email,
    password
  };
  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  });
});

// POST /api/auth/login - User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(
    u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

// POST /api/orders - Create and process a new order
app.post('/api/orders', (req, res) => {
  const { userId, customerName, customerEmail, shippingAddress, items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const db = readDB();
  let totalAmount = 0;

  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.productId} not found` });
    }
    totalAmount += product.price * item.quantity;
    product.stock = Math.max(0, product.stock - item.quantity);
  }

  const newOrder = {
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    userId: userId || 'guest',
    customerName: customerName || 'Guest Customer',
    customerEmail: customerEmail || '',
    shippingAddress: shippingAddress || '',
    items,
    totalAmount: Number(totalAmount.toFixed(2)),
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  writeDB(db);

  res.status(201).json(newOrder);
});

// GET /api/orders - Get orders (optionally filtered by userId)
app.get('/api/orders', (req, res) => {
  const db = readDB();
  const { userId } = req.query;
  if (userId) {
    return res.json(db.orders.filter(o => o.userId === userId));
  }
  res.json(db.orders);
});

app.listen(PORT, () => {
  console.log(`CodeAlpha E-Commerce Server running on http://localhost:${PORT}`);
});
