const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const cors = require('cors');

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./config/serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// GET all products
app.get('/api/products', async (req, res) => {
  const snapshot = await db.collection('products').get();
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(products);
});

// POST a new product
app.post('/api/products', async (req, res) => {
  const newProduct = req.body;
  const docRef = await db.collection('products').add(newProduct);
  res.json({ id: docRef.id, ...newProduct });
});

// DELETE a product by ID
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  await db.collection('products').doc(id).delete();
  res.json({ message: 'Product deleted' });
});

// POST a new order
app.post('/api/orders', async (req, res) => {
  const newOrder = req.body;
  const docRef = await db.collection('orders').add({
    ...newOrder,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  });
  res.json({ id: docRef.id, ...newOrder });
});

// GET orders for a specific buyer
app.get('/api/orders/buyer/:email', async (req, res) => {
  const { email } = req.params;
  const snapshot = await db.collection('orders').where('buyerEmail', '==', email).get();
  const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(orders);
});

// GET orders containing products from a specific vendor
app.get('/api/orders/vendor/:email', async (req, res) => {
  const { email } = req.params;
  const snapshot = await db.collection('orders').where('vendorEmails', 'array-contains', email).get();
  const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(orders);
});

// PATCH an order's status
app.patch('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await db.collection('orders').doc(id).update({ status });
  res.json({ message: 'Order updated' });
});

// POST a new review (only for delivered orders, one review per order+product)
app.post('/api/reviews', async (req, res) => {
  const { productId, orderId, buyerEmail, rating, comment } = req.body;

  const orderDoc = await db.collection('orders').doc(orderId).get();
  if (!orderDoc.exists) return res.status(404).json({ error: 'Order not found' });

  const order = orderDoc.data();
  if (order.buyerEmail !== buyerEmail) return res.status(403).json({ error: 'Not your order' });
  if (order.status !== 'Delivered') return res.status(400).json({ error: 'Order not delivered yet' });

  const hasItem = order.items.some((item) => item.id === productId);
  if (!hasItem) return res.status(400).json({ error: 'Product not in this order' });

  const existing = await db.collection('reviews')
    .where('orderId', '==', orderId)
    .where('productId', '==', productId)
    .get();
  if (!existing.empty) return res.status(400).json({ error: 'Already reviewed' });

  const docRef = await db.collection('reviews').add({
    productId,
    orderId,
    buyerEmail,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
  });
  res.json({ id: docRef.id });
});

// GET all reviews for one product
app.get('/api/reviews/product/:productId', async (req, res) => {
  const { productId } = req.params;
  const snapshot = await db.collection('reviews').where('productId', '==', productId).get();
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(reviews);
});

// GET everything one buyer has reviewed so far
app.get('/api/reviews/buyer/:email', async (req, res) => {
  const { email } = req.params;
  const snapshot = await db.collection('reviews').where('buyerEmail', '==', email).get();
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(reviews);
});

// GET average rating + count for every product at once
app.get('/api/reviews/summary', async (req, res) => {
  const snapshot = await db.collection('reviews').get();
  const totals = {};
  snapshot.docs.forEach((doc) => {
    const { productId, rating } = doc.data();
    if (!totals[productId]) totals[productId] = { sum: 0, count: 0 };
    totals[productId].sum += rating;
    totals[productId].count += 1;
  });
  const summary = {};
  Object.keys(totals).forEach((id) => {
    summary[id] = { avg: totals[id].sum / totals[id].count, count: totals[id].count };
  });
  res.json(summary);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});