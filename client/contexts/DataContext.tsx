import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { customerApi, productApi, orderApi } from '@/services/api';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  variants: string[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  loading: boolean;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  getProductById: (id: string) => Product | undefined;
  refetchData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customersData, productsData, ordersData] = await Promise.all([
        customerApi.getAll(),
        productApi.getAll(),
        orderApi.getAll(),
      ]);
      setCustomers(customersData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const newCustomer = await customerApi.create(customerData);
      setCustomers(prev => [...prev, newCustomer]);
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      const updatedCustomer = await customerApi.update(id, customerData);
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? updatedCustomer : customer
      ));
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customerApi.delete(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await productApi.create(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await productApi.update(id, productData);
      setProducts(prev => prev.map(product => 
        product.id === id ? updatedProduct : product
      ));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productApi.delete(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newOrder = await orderApi.create(orderData);
      setOrders(prev => [...prev, newOrder]);
    } catch (error) {
      console.error('Failed to add order:', error);
      throw error;
    }
  };

  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    try {
      const updatedOrder = await orderApi.update(id, orderData);
      setOrders(prev => prev.map(order => 
        order.id === id ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await orderApi.delete(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  };

  const getCustomerById = (id: string) => customers.find(customer => customer.id === id);
  const getProductById = (id: string) => products.find(product => product.id === id);

  const refetchData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider value={{
      customers,
      products,
      orders,
      loading,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrder,
      deleteOrder,
      getCustomerById,
      getProductById,
      refetchData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
