import { RequestHandler } from "express";

export interface ProductVariant {
  id: string;
  name: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: ProductVariant[];
  totalStock: number;
}

// In-memory storage (replace with database in production)
let products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality headphones with noise cancellation',
    price: 35.0,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
    variants: [
      { id: 'v1', name: 'Black', stock: 25 },
      { id: 'v2', name: 'White', stock: 15 },
      { id: 'v3', name: 'Silver', stock: 5 }
    ],
    totalStock: 45
  },
  {
    id: '2',
    name: 'Adjustable Laptop Stand',
    description: 'Ergonomic laptop stand for better posture',
    price: 17.5,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'],
    variants: [
      { id: 'v1', name: 'Natural Wood', stock: 13 },
      { id: 'v2', name: 'Black', stock: 10 }
    ],
    totalStock: 23
  },
  {
    id: '3',
    name: 'USB-C Cable 6ft',
    description: 'Fast charging USB-C to USB-C cable',
    price: 5.0,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'],
    variants: [
      { id: 'v1', name: 'Black', stock: 70 },
      { id: 'v2', name: 'White', stock: 50 }
    ],
    totalStock: 120
  },
  {
    id: '4',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 12-hour battery life',
    price: 50.0,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'],
    variants: [
      { id: 'v1', name: 'Red', stock: 3 },
      { id: 'v2', name: 'Blue', stock: 2 },
      { id: 'v3', name: 'Black', stock: 3 }
    ],
    totalStock: 8
  }
];

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const getAllProducts: RequestHandler = (req, res) => {
  res.json(products);
};

export const createProduct: RequestHandler = (req, res) => {
  const { name, description, price, images, variants } = req.body;
  
  if (!name || !description || price === undefined) {
    return res.status(400).json({ error: 'Name, description, and price are required' });
  }

  // Calculate total stock from variants
  const totalStock = variants ? variants.reduce((sum: number, variant: ProductVariant) => sum + variant.stock, 0) : 0;

  const newProduct: Product = {
    id: generateId(),
    name,
    description,
    price: parseFloat(price),
    images: Array.isArray(images) ? images : [],
    variants: Array.isArray(variants) ? variants.map((v: any) => ({
      id: v.id || generateId(),
      name: v.name,
      stock: parseInt(v.stock) || 0
    })) : [],
    totalStock
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
  
  // Recalculate total stock if variants are updated
  if (updates.variants) {
    updates.totalStock = updates.variants.reduce((sum: number, variant: ProductVariant) => sum + variant.stock, 0);
  }

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
