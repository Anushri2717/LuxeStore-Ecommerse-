const express = require('express');
const cors = require('cors');
const data = require('./data.json');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET all products
app.get('/api/products', (req, res) => {
  const { category, search, sort, limit } = req.query;
  let products = [...data.products];

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
  if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
  if (sort === 'newest') products.sort((a, b) => b.id - a.id);
  if (limit) products = products.slice(0, parseInt(limit));

  res.json({ success: true, count: products.length, data: products });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = data.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const related = data.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  res.json({ success: true, data: { ...product, related } });
});

// GET categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: data.categories });
});

// GET banners
app.get('/api/banners', (req, res) => {
  res.json({ success: true, data: data.banners });
});

// GET testimonials
app.get('/api/testimonials', (req, res) => {
  res.json({ success: true, data: data.testimonials });
});

// POST add to cart (mock)
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = data.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, message: 'Added to cart', item: { ...product, quantity } });
});

// POST checkout (mock)
app.post('/api/checkout', (req, res) => {
  const { items, total } = req.body;
  const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  res.json({ success: true, orderId, message: 'Order placed successfully', total });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));