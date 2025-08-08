-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    images JSONB DEFAULT '[]'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    total_stock INTEGER DEFAULT 0 CHECK (total_stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'delivered', 'picked-up')),
    delivery_type TEXT NOT NULL DEFAULT 'delivery' CHECK (delivery_type IN ('delivery', 'pickup')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS customers_name_idx ON customers(name);
CREATE INDEX IF NOT EXISTS customers_created_at_idx ON customers(created_at);

CREATE INDEX IF NOT EXISTS products_name_idx ON products(name);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at);

CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders(customer_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);

-- Create trigger function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE OR REPLACE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample customers
INSERT INTO customers (name, phone, address) VALUES
('Alice Johnson', '+1 (555) 123-4567', '123 Main St, Springfield, IL 62701'),
('Bob Smith', '+1 (555) 234-5678', '456 Oak Ave, Springfield, IL 62702'),
('Carol Davis', '+1 (555) 345-6789', '789 Pine Rd, Springfield, IL 62703')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, images, variants, total_stock) VALUES
(
    'Wireless Bluetooth Headphones',
    'Premium quality headphones with noise cancellation',
    35.00,
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"]'::jsonb,
    '[
        {"id": "v1", "name": "Black", "stock": 25},
        {"id": "v2", "name": "White", "stock": 15},
        {"id": "v3", "name": "Silver", "stock": 5}
    ]'::jsonb,
    45
),
(
    'Adjustable Laptop Stand',
    'Ergonomic laptop stand for better posture',
    17.50,
    '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop"]'::jsonb,
    '[
        {"id": "v1", "name": "Natural Wood", "stock": 13},
        {"id": "v2", "name": "Black", "stock": 10}
    ]'::jsonb,
    23
),
(
    'USB-C Cable 6ft',
    'Fast charging USB-C to USB-C cable',
    5.00,
    '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"]'::jsonb,
    '[
        {"id": "v1", "name": "Black", "stock": 70},
        {"id": "v2", "name": "White", "stock": 50}
    ]'::jsonb,
    120
),
(
    'Portable Bluetooth Speaker',
    'Waterproof speaker with 12-hour battery life',
    50.00,
    '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"]'::jsonb,
    '[
        {"id": "v1", "name": "Red", "stock": 3},
        {"id": "v2", "name": "Blue", "stock": 2},
        {"id": "v3", "name": "Black", "stock": 3}
    ]'::jsonb,
    8
)
ON CONFLICT DO NOTHING;

-- Insert sample orders (these will reference the customer and product IDs)
-- Note: In a real scenario, you'd want to use the actual UUIDs from the database
-- For now, we'll let the application create orders via the API
