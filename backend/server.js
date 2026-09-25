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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});