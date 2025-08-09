-- Azhar Store - Supabase Database Schema
-- Copy and paste this SQL into your Supabase SQL Editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    total_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    home VARCHAR(100),
    road VARCHAR(100),
    block VARCHAR(100),
    town VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'delivered', 'picked-up')),
    delivery_type VARCHAR(20) DEFAULT 'delivery' CHECK (delivery_type IN ('delivery', 'pickup')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO categories (id, name) VALUES 
    ('1', 'Electronics'),
    ('2', 'Accessories'),
    ('3', 'Home & Office')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, price, images, variants, total_stock, category_id) VALUES 
    (
        '1',
        'Wireless Bluetooth Headphones',
        'Premium quality headphones with noise cancellation',
        35.00,
        '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"]',
        '[
            {"id": "v1", "name": "Black", "stock": 25},
            {"id": "v2", "name": "White", "stock": 15},
            {"id": "v3", "name": "Silver", "stock": 5}
        ]',
        45,
        '1'
    ),
    (
        '2',
        'Adjustable Laptop Stand',
        'Ergonomic laptop stand for better posture',
        17.50,
        '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop"]',
        '[
            {"id": "v1", "name": "Natural Wood", "stock": 13},
            {"id": "v2", "name": "Black", "stock": 10}
        ]',
        23,
        '2'
    ),
    (
        '3',
        'USB-C Cable 6ft',
        'Fast charging USB-C to USB-C cable',
        5.00,
        '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"]',
        '[
            {"id": "v1", "name": "Black", "stock": 70},
            {"id": "v2", "name": "White", "stock": 50}
        ]',
        120,
        '2'
    ),
    (
        '4',
        'Portable Bluetooth Speaker',
        'Waterproof speaker with 12-hour battery life',
        50.00,
        '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"]',
        '[
            {"id": "v1", "name": "Red", "stock": 3},
            {"id": "v2", "name": "Blue", "stock": 2},
            {"id": "v3", "name": "Black", "stock": 3}
        ]',
        8,
        '1'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, name, phone, address, home, road, block, town) VALUES 
    ('1', 'Alice Johnson', '+1 (555) 123-4567', 'House 123, Road 15, Block 304, Springfield', '123', '15', '304', 'Springfield'),
    ('2', 'Bob Smith', '+1 (555) 234-5678', 'House 456, Road 22, Block 205, Manama', '456', '22', '205', 'Manama'),
    ('3', 'Carol Davis', '+1 (555) 345-6789', 'House 789, Road 33, Block 102, Riffa', '789', '33', '102', 'Riffa')
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (id, customer_id, items, total, status, delivery_type) VALUES 
    (
        '1',
        '1',
        '[{"productId": "1", "quantity": 1, "price": 35.0}]',
        35.00,
        'delivered',
        'delivery'
    ),
    (
        '2',
        '2',
        '[{"productId": "2", "quantity": 1, "price": 17.5}]',
        17.50,
        'processing',
        'pickup'
    )
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Optional, for production use
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (uncomment for production use)
-- CREATE POLICY "Allow all operations on categories" ON categories FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
