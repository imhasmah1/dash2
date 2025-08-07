const express = require('express');
const cors = require('cors');
const path = require('path');

// Import route handlers
const { handleDemo } = require('../server/routes/demo');
const { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../server/routes/customers');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../server/routes/products');
const { getAllOrders, createOrder, updateOrder, deleteOrder } = require('../server/routes/orders');
const { uploadMiddleware, handleImageUpload, deleteImage } = require('../server/routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/ping', (req, res) => {
  const ping = process.env.PING_MESSAGE ?? 'ping';
  res.json({ message: ping });
});

app.get('/api/demo', handleDemo);

// Upload routes
app.post('/api/upload', uploadMiddleware, handleImageUpload);
app.delete('/api/upload/:filename', deleteImage);

// Customer routes
app.get('/api/customers', getAllCustomers);
app.post('/api/customers', createCustomer);
app.put('/api/customers/:id', updateCustomer);
app.delete('/api/customers/:id', deleteCustomer);

// Product routes
app.get('/api/products', getAllProducts);
app.post('/api/products', createProduct);
app.put('/api/products/:id', updateProduct);
app.delete('/api/products/:id', deleteProduct);

// Order routes
app.get('/api/orders', getAllOrders);
app.post('/api/orders', createOrder);
app.put('/api/orders/:id', updateOrder);
app.delete('/api/orders/:id', deleteOrder);

module.exports = app;
