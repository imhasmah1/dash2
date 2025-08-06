import { RequestHandler } from "express";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  variants: string[];
}

// In-memory storage (replace with database in production)
let products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality headphones with noise cancellation',
    price: 89.99,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    variants: ['Black', 'White', 'Silver']
  },
  {
    id: '2',
    name: 'Adjustable Laptop Stand',
    description: 'Ergonomic laptop stand for better posture',
    price: 45.00,
    stock: 23,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
    variants: ['Natural Wood', 'Black']
  },
  {
    id: '3',
    name: 'USB-C Cable 6ft',
    description: 'Fast charging USB-C to USB-C cable',
    price: 12.99,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    variants: ['Black', 'White']
  },
  {
    id: '4',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 12-hour battery life',
    price: 129.99,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop',
    variants: ['Red', 'Blue', 'Black']
  }
];

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const getAllProducts: RequestHandler = (req, res) => {
  res.json(products);
};

export const createProduct: RequestHandler = (req, res) => {
  const { name, description, price, stock, image, variants } = req.body;
  
  if (!name || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Name, description, price, and stock are required' });
  }

  const newProduct: Product = {
    id: generateId(),
    name,
    description,
    price: parseFloat(price),
    stock: parseInt(stock),
    image: image || '',
    variants: Array.isArray(variants) ? variants : []
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

export const updateProduct: RequestHandler = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (updates.price !== undefined) updates.price = parseFloat(updates.price);
  if (updates.stock !== undefined) updates.stock = parseInt(updates.stock);

  products[productIndex] = { ...products[productIndex], ...updates };
  res.json(products[productIndex]);
};

export const deleteProduct: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
};
