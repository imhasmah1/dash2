import { supabase } from './supabase';

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
  created_at?: string;
  updated_at?: string;
  notes?: string;
}

// In-memory fallback storage
let fallbackOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    items: [
      { productId: '1', quantity: 1, price: 35.0 }
    ],
    total: 35.0,
    status: 'delivered',
    deliveryType: 'delivery',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T15:30:00Z'
  },
  {
    id: '2',
    customerId: '2',
    items: [
      { productId: '2', quantity: 1, price: 17.5 }
    ],
    total: 17.5,
    status: 'processing',
    deliveryType: 'pickup',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  }
];

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const orderDb = {
  // Get all orders
  async getAll(): Promise<Order[]> {
    if (!supabase) {
      return fallbackOrders;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        return fallbackOrders;
      }

      return data || [];
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      return fallbackOrders;
    }
  },

  // Create a new order
  async create(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!supabase) {
      fallbackOrders.push(newOrder);
      return newOrder;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();

      if (error) {
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        fallbackOrders.push(newOrder);
        return newOrder;
      }

      return data;
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      fallbackOrders.push(newOrder);
      return newOrder;
    }
  },

  // Update an order
  async update(id: string, updates: Partial<Order>): Promise<Order> {
    if (!supabase) {
      const index = fallbackOrders.findIndex(o => o.id === id);
      if (index === -1) {
        throw new Error('Order not found');
      }
      fallbackOrders[index] = { 
        ...fallbackOrders[index], 
        ...updates, 
        updated_at: new Date().toISOString() 
      };
      return fallbackOrders[index];
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        const index = fallbackOrders.findIndex(o => o.id === id);
        if (index === -1) {
          throw new Error('Order not found');
        }
        fallbackOrders[index] = { 
          ...fallbackOrders[index], 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        return fallbackOrders[index];
      }

      return data;
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      const index = fallbackOrders.findIndex(o => o.id === id);
      if (index === -1) {
        throw new Error('Order not found');
      }
      fallbackOrders[index] = { 
        ...fallbackOrders[index], 
        ...updates, 
        updated_at: new Date().toISOString() 
      };
      return fallbackOrders[index];
    }
  },

  // Delete an order
  async delete(id: string): Promise<void> {
    if (!supabase) {
      const index = fallbackOrders.findIndex(o => o.id === id);
      if (index === -1) {
        throw new Error('Order not found');
      }
      fallbackOrders.splice(index, 1);
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        const index = fallbackOrders.findIndex(o => o.id === id);
        if (index === -1) {
          throw new Error('Order not found');
        }
        fallbackOrders.splice(index, 1);
        return;
      }
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      const index = fallbackOrders.findIndex(o => o.id === id);
      if (index === -1) {
        throw new Error('Order not found');
      }
      fallbackOrders.splice(index, 1);
    }
  },

  // Get a single order by ID
  async getById(id: string): Promise<Order | null> {
    if (!supabase) {
      return fallbackOrders.find(o => o.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        return fallbackOrders.find(o => o.id === id) || null;
      }

      return data;
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      return fallbackOrders.find(o => o.id === id) || null;
    }
  }
};
