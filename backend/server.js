const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./config/serviceAccountKey.json');
const cors = require('cors');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

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
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});