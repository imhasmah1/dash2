import { RequestHandler } from "express";

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'ready' | 'delivered' | 'picked-up';
  deliveryType: 'delivery' | 'pickup';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// In-memory storage (replace with database in production)
let orders: Order[] = [
  {
    id: '1',
    customerId: '1',
    items: [
      { productId: '1', quantity: 1, price: 89.99 }
    ],
    total: 89.99,
    status: 'completed',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T15:30:00Z'
  },
  {
    id: '2',
    customerId: '2',
    items: [
      { productId: '2', quantity: 1, price: 45.00 }
    ],
    total: 45.00,
    status: 'processing',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
];

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const getAllOrders: RequestHandler = (req, res) => {
  res.json(orders);
};

export const createOrder: RequestHandler = (req, res) => {
  const { customerId, items, status } = req.body;
  
  if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer ID and items are required' });
  }

  const total = items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);

  const newOrder: Order = {
    id: generateId(),
    customerId,
    items,
    total,
    status: status || 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
};

export const updateOrder: RequestHandler = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Recalculate total if items are updated
  if (updates.items) {
    updates.total = updates.items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
  }

  orders[orderIndex] = { 
    ...orders[orderIndex], 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  res.json(orders[orderIndex]);
};

export const deleteOrder: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders.splice(orderIndex, 1);
  res.status(204).send();
};
