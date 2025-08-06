import { RequestHandler } from "express";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
}

// In-memory storage (replace with database in production)
let customers: Customer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Springfield, IL 62701',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Bob Smith',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, Springfield, IL 62702',
    createdAt: '2024-01-12T14:30:00Z'
  },
  {
    id: '3',
    name: 'Carol Davis',
    phone: '+1 (555) 345-6789',
    address: '789 Pine Rd, Springfield, IL 62703',
    createdAt: '2024-01-14T09:15:00Z'
  }
];

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const getAllCustomers: RequestHandler = (req, res) => {
  res.json(customers);
};

export const createCustomer: RequestHandler = (req, res) => {
  const { name, phone, address } = req.body;
  
  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Name, phone, and address are required' });
  }

  const newCustomer: Customer = {
    id: generateId(),
    name,
    phone,
    address,
    createdAt: new Date().toISOString()
  };

  customers.push(newCustomer);
  res.status(201).json(newCustomer);
};

export const updateCustomer: RequestHandler = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  customers[customerIndex] = { ...customers[customerIndex], ...updates };
  res.json(customers[customerIndex]);
};

export const deleteCustomer: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  customers.splice(customerIndex, 1);
  res.status(204).send();
};
