// Fallback seed data so the app works both with Express.js backend AND standalone in browser
const FALLBACK_PRODUCTS = [
  {
    id: 'p1',
    name: 'AeroPulse Wireless ANC Headphones',
    category: 'Audio',
    price: 199.99,
    rating: 4.8,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'Studio-grade active noise cancellation, 40-hour battery life, spatial audio support, and ultra-soft memory foam ear cushions.'
  },
  {
    id: 'p2',
    name: 'ChronoFit Pro Smart Watch',
    category: 'Wearables',
    price: 249.50,
    rating: 4.7,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: 'AMOLED sapphire display with continuous ECG, blood oxygen monitoring, dual-band GPS, and 7-day battery endurance.'
  },
  {
    id: 'p3',
    name: 'KeyCraft Mechanical Keyboard 75%',
    category: 'Accessories',
    price: 129.00,
    rating: 4.9,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    description: 'Hot-swappable tactile switches, gasket-mounted CNC aluminum frame, per-key RGB, and tri-mode wireless connectivity.'
  },
  {
    id: 'p4',
    name: 'LumaLens 4K Mirrorless Camera',
    category: 'Photography',
    price: 899.00,
    rating: 4.9,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    description: 'Full-frame 33MP sensor, 5-axis in-body stabilization, real-time eye autofocus, and 10-bit 4K 60fps video recording.'
  },
  {
    id: 'p5',
    name: 'SonicWave Portable Bluetooth Speaker',
    category: 'Audio',
    price: 89.99,
    rating: 4.6,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    description: '360-degree immersive bass, IP67 waterproof & dustproof rating, and 24 hours of continuous outdoor playback.'
  },
  {
    id: 'p6',
    name: 'ErgoGlide Vertical Wireless Mouse',
    category: 'Accessories',
    price: 59.99,
    rating: 4.5,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    description: 'Precision 8000 DPI optical sensor, whisper-quiet switches, ergonomic wrist posture design, and USB-C fast charging.'
  }
];

let allProducts = [];
let activeCategory = 'All';
let searchQuery = '';
let cart = JSON.parse(localStorage.getItem('ca_ecom_cart') || '[]');
let currentUser = JSON.parse(localStorage.getItem('ca_ecom_user') || 'null');
let authMode = 'login';

const productGrid = document.getElementById('productGrid');
const productCountText = document.getElementById('productCountText');
const cartCountBadge = document.getElementById('cartCountBadge');
const toastEl = document.getElementById('toast');

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 2600);
}

// Fetch products from Express API with automatic fallback
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('API unavailable');
    allProducts = await res.json();
  } catch {
    const saved = localStorage.getItem('ca_ecom_products');
    allProducts = saved ? JSON.parse(saved) : FALLBACK_PRODUCTS;
    localStorage.setItem('ca_ecom_products', JSON.stringify(allProducts));
  }
  renderProducts();
}

function renderProducts() {
  const filtered = allProducts.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  productCountText.textContent = `${filtered.length} product${filtered.length === 1 ? '' : 's'} available`;

  productGrid.innerHTML = filtered
    .map(
      p => `
    <article class="product-card">
      <div class="product-img-wrap" onclick="openProductDetail('${p.id}')">
        <span class="category-tag">${p.category}</span>
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <h3 class="product-title" onclick="openProductDetail('${p.id}')">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <div>
            <span class="price">$${p.price.toFixed(2)}</span>
            <div class="muted">⭐ ${p.rating} · ${p.stock} in stock</div>
          </div>
          <button class="btn btn-primary" onclick="addToCart('${p.id}')">+ Add</button>
        </div>
      </div>
    </article>
  `
    )
    .join('');
}

// Product Details Modal
window.openProductDetail = function (productId) {
  const p = allProducts.find(item => item.id === productId);
  if (!p) return;
  const container = document.getElementById('productDetailContent');
  container.innerHTML = `
    <div class="detail-grid">
      <img src="${p.image}" alt="${p.name}" />
      <div>
        <span class="pill">${p.category}</span>
        <h2 style="margin-bottom:0.5rem;">${p.name}</h2>
        <p class="muted" style="margin-bottom:1rem;">⭐ ${p.rating} Rating · ${p.stock} Units Available</p>
        <p style="margin-bottom:1.25rem;">${p.description}</p>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
          <span class="price" style="font-size:1.6rem;">$${p.price.toFixed(2)}</span>
          <button class="btn btn-primary" onclick="addToCart('${p.id}'); closeProductModal();">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('productModal').classList.remove('hidden');
};

window.closeProductModal = function () {
  document.getElementById('productModal').classList.add('hidden');
};

document.getElementById('closeProductModal').addEventListener('click', closeProductModal);

// Shopping Cart functions
window.addToCart = function (productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  saveCart();
  showToast(`Added "${product.name}" to cart!`);
};

window.changeQty = function (productId, delta) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.productId !== productId);
  }
  saveCart();
  renderCart();
};

function saveCart() {
  localStorage.setItem('ca_ecom_cart', JSON.stringify(cart));
  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  cartCountBadge.textContent = totalCount;
}

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  const totalEl = document.getElementById('cartTotalValue');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    container.innerHTML = `<p class="muted" style="text-align:center; margin-top:2rem;">Your cart is currently empty.</p>`;
    footer.classList.add('hidden');
    return;
  }

  footer.classList.remove('hidden');
  let total = 0;
  container.innerHTML = cart
    .map(item => {
      const sub = item.price * item.quantity;
      total += sub;
      return `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="muted">$${item.price.toFixed(2)} × ${item.quantity} = <strong>$${sub.toFixed(2)}</strong></span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.productId}', -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty('${item.productId}', 1)">+</button>
        </div>
      </div>
    `;
    })
    .join('');

  totalEl.textContent = `$${total.toFixed(2)}`;

  if (currentUser) {
    document.getElementById('checkoutName').value = currentUser.name;
    document.getElementById('checkoutEmail').value = currentUser.email;
  }
}

document.getElementById('cartNavBtn').addEventListener('click', () => {
  renderCart();
  document.getElementById('cartModal').classList.remove('hidden');
});

document.getElementById('closeCartModal').addEventListener('click', () => {
  document.getElementById('cartModal').classList.add('hidden');
});

// Order Checkout Processing
document.getElementById('checkoutForm').addEventListener('submit', async e => {
  e.preventDefault();
  if (cart.length === 0) return;

  const payload = {
    userId: currentUser ? currentUser.id : 'guest',
    customerName: document.getElementById('checkoutName').value.trim(),
    customerEmail: document.getElementById('checkoutEmail').value.trim(),
    shippingAddress: document.getElementById('checkoutAddress').value.trim(),
    items: cart
  };

  let createdOrder;
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Fallback order');
    createdOrder = await res.json();
  } catch {
    const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    createdOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      ...payload,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    const localOrders = JSON.parse(localStorage.getItem('ca_ecom_orders') || '[]');
    localOrders.unshift(createdOrder);
    localStorage.setItem('ca_ecom_orders', JSON.stringify(localOrders));
  }

  cart = [];
  saveCart();
  document.getElementById('checkoutForm').reset();
  document.getElementById('cartModal').classList.add('hidden');
  showToast(`Order ${createdOrder.id} confirmed!`);
  loadProducts();
});

// User Authentication (Login / Register)
function updateAuthUI() {
  const authNavBtn = document.getElementById('authNavBtn');
  const authForm = document.getElementById('authForm');
  const profileBox = document.getElementById('userProfileBox');

  if (currentUser) {
    authNavBtn.textContent = `👤 ${currentUser.name}`;
    authForm.classList.add('hidden');
    profileBox.classList.remove('hidden');
    document.getElementById('loggedInUserName').textContent = currentUser.name;
    document.getElementById('loggedInUserEmail').textContent = currentUser.email;
  } else {
    authNavBtn.textContent = '👤 Login / Register';
    authForm.classList.remove('hidden');
    profileBox.classList.add('hidden');
  }
}

document.getElementById('authNavBtn').addEventListener('click', () => {
  updateAuthUI();
  document.getElementById('authModal').classList.remove('hidden');
});

document.getElementById('closeAuthModal').addEventListener('click', () => {
  document.getElementById('authModal').classList.add('hidden');
});

document.getElementById('tabLogin').addEventListener('click', () => {
  authMode = 'login';
  document.getElementById('tabLogin').classList.add('active');
  document.getElementById('tabRegister').classList.remove('active');
  document.getElementById('nameFieldGroup').classList.add('hidden');
  document.getElementById('authSubmitBtn').textContent = 'Sign In';
});

document.getElementById('tabRegister').addEventListener('click', () => {
  authMode = 'register';
  document.getElementById('tabRegister').classList.add('active');
  document.getElementById('tabLogin').classList.remove('active');
  document.getElementById('nameFieldGroup').classList.remove('hidden');
  document.getElementById('authSubmitBtn').textContent = 'Create Account';
});

document.getElementById('authForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('authName').value.trim() || 'CodeAlpha Member';
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;

  const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error('Auth fallback');
    currentUser = await res.json();
  } catch {
    currentUser = { id: 'u-' + Date.now(), name, email };
  }

  localStorage.setItem('ca_ecom_user', JSON.stringify(currentUser));
  updateAuthUI();
  document.getElementById('authModal').classList.add('hidden');
  showToast(`Welcome, ${currentUser.name}!`);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('ca_ecom_user');
  updateAuthUI();
  showToast('Signed out successfully');
});

// Orders History Modal
document.getElementById('ordersNavBtn').addEventListener('click', async () => {
  const container = document.getElementById('ordersListContainer');
  let orders = [];
  try {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Fallback orders');
    orders = await res.json();
  } catch {
    orders = JSON.parse(localStorage.getItem('ca_ecom_orders') || '[]');
  }

  if (orders.length === 0) {
    container.innerHTML = `<p class="muted" style="padding:1.5rem 0;">No orders placed yet. Add items to your cart and check out!</p>`;
  } else {
    container.innerHTML = orders
      .map(
        o => `
      <div class="order-card">
        <div class="order-card-header">
          <span>${o.id} — ${o.customerName}</span>
          <span style="color:var(--accent);">$${Number(o.totalAmount).toFixed(2)}</span>
        </div>
        <p class="muted">Status: <strong>${o.status}</strong> · ${new Date(o.createdAt).toLocaleString()}</p>
        <p class="muted">Ship to: ${o.shippingAddress}</p>
        <ul style="margin-top:0.5rem; padding-left:1.2rem; font-size:0.88rem;">
          ${o.items.map(i => `<li>${i.name} × ${i.quantity}</li>`).join('')}
        </ul>
      </div>
    `
      )
      .join('');
  }
  document.getElementById('ordersModal').classList.remove('hidden');
});

document.getElementById('closeOrdersModal').addEventListener('click', () => {
  document.getElementById('ordersModal').classList.add('hidden');
});

// Category and Search filters
document.getElementById('categoryFilter').addEventListener('click', e => {
  const btn = e.target.closest('.cat-btn');
  if (!btn) return;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = btn.dataset.cat;
  renderProducts();
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  renderProducts();
});

// Initialize
saveCart();
updateAuthUI();
loadProducts();
