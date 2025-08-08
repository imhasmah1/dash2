import { supabase } from './supabase';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

// In-memory fallback storage
let fallbackCustomers: Customer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Springfield, IL 62701',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Bob Smith',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, Springfield, IL 62702',
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z'
  },
  {
    id: '3',
    name: 'Carol Davis',
    phone: '+1 (555) 345-6789',
    address: '789 Pine Rd, Springfield, IL 62703',
    created_at: '2024-01-14T09:15:00Z',
    updated_at: '2024-01-14T09:15:00Z'
  }
];

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const customerDb = {
  // Get all customers
  async getAll(): Promise<Customer[]> {
    if (!supabase) {
      return fallbackCustomers;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        return fallbackCustomers;
      }

      return data || [];
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      return fallbackCustomers;
    }
  },

  // Create a new customer
  async create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!supabase) {
      fallbackCustomers.push(newCustomer);
      return newCustomer;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([newCustomer])
        .select()
        .single();

      if (error) {
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        fallbackCustomers.push(newCustomer);
        return newCustomer;
      }

      return data;
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      fallbackCustomers.push(newCustomer);
      return newCustomer;
    }
  },

  // Update a customer
  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    if (!supabase) {
      const index = fallbackCustomers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Customer not found');
      }
      fallbackCustomers[index] = { 
        ...fallbackCustomers[index], 
        ...updates, 
        updated_at: new Date().toISOString() 
      };
      return fallbackCustomers[index];
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        const index = fallbackCustomers.findIndex(c => c.id === id);
        if (index === -1) {
          throw new Error('Customer not found');
        }
        fallbackCustomers[index] = { 
          ...fallbackCustomers[index], 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        return fallbackCustomers[index];
      }

      return data;
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      const index = fallbackCustomers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Customer not found');
      }
      fallbackCustomers[index] = { 
        ...fallbackCustomers[index], 
        ...updates, 
        updated_at: new Date().toISOString() 
      };
      return fallbackCustomers[index];
    }
  },

  // Delete a customer
  async delete(id: string): Promise<void> {
    if (!supabase) {
      const index = fallbackCustomers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Customer not found');
      }
      fallbackCustomers.splice(index, 1);
      return;
    }

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        const index = fallbackCustomers.findIndex(c => c.id === id);
        if (index === -1) {
          throw new Error('Customer not found');
        }
        fallbackCustomers.splice(index, 1);
        return;
      }
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      const index = fallbackCustomers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Customer not found');
      }
      fallbackCustomers.splice(index, 1);
    }
  },

  // Get a single customer by ID
  async getById(id: string): Promise<Customer | null> {
    if (!supabase) {
      return fallbackCustomers.find(c => c.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.warn('Supabase error, falling back to in-memory storage:', error.message);
        return fallbackCustomers.find(c => c.id === id) || null;
      }

      return data;
    } catch (error) {
      console.warn('Supabase connection failed, using in-memory storage');
      return fallbackCustomers.find(c => c.id === id) || null;
    }
  }
};
