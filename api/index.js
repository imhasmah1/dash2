// Note: For Vercel deployment, file uploads might need to be handled differently
// as serverless functions have limited write access. Consider using cloud storage.

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  const path = url.replace("/api", "");

  try {
    // Route handling
    if (path === "/ping") {
      return res.json({ message: process.env.PING_MESSAGE ?? "ping" });
    }

    if (path === "/demo") {
      return res.json({ message: "Demo endpoint from Vercel!" });
    }

    // Customers routes
    if (path === "/customers") {
      if (method === "GET") return handleGetCustomers(req, res);
      if (method === "POST") return handleCreateCustomer(req, res);
    }

    if (path.startsWith("/customers/")) {
      const id = path.split("/")[2];
      if (method === "PUT") return handleUpdateCustomer(req, res, id);
      if (method === "DELETE") return handleDeleteCustomer(req, res, id);
    }

    // Products routes
    if (path === "/products") {
      if (method === "GET") return handleGetProducts(req, res);
      if (method === "POST") return handleCreateProduct(req, res);
    }

    if (path.startsWith("/products/")) {
      const id = path.split("/")[2];
      if (method === "GET") return handleGetProductById(req, res, id);
      if (method === "PUT") return handleUpdateProduct(req, res, id);
      if (method === "DELETE") return handleDeleteProduct(req, res, id);
    }

    // Orders routes
    if (path === "/orders") {
      if (method === "GET") return handleGetOrders(req, res);
      if (method === "POST") return handleCreateOrder(req, res);
    }

    if (path.startsWith("/orders/")) {
      const id = path.split("/")[2];
      if (method === "PUT") return handleUpdateOrder(req, res, id);
      if (method === "DELETE") return handleDeleteOrder(req, res, id);
    }

    // Upload endpoint (Note: In production, consider using cloud storage)
    if (path === "/upload") {
      return res.status(501).json({
        error:
          "File upload not implemented for Vercel deployment. Please use cloud storage.",
      });
    }

    // 404 for unknown routes
    res.status(404).json({ error: "Not found" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// In-memory data stores (replace with database in production)
let customers = [
  {
    id: "1",
    name: "Ahmed Al-Rashid",
    phone: "+973-3456-7890",
    address: "Manama, Bahrain",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Fatima Al-Zahra",
    phone: "+973-3456-7891",
    address: "Riffa, Bahrain",
    createdAt: new Date().toISOString(),
  },
];

let products = [];

let orders = [
  {
    id: "1",
    customerId: "1",
    items: [{ productId: "2", variantId: "v1", quantity: 1, price: 17.5 }],
    total: 17.5,
    status: "processing",
    deliveryType: "delivery",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: "Please deliver before 6 PM",
  },
];

// Helper functions
const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Customer handlers
function handleGetCustomers(req, res) {
  res.json(customers);
}

function handleCreateCustomer(req, res) {
  const { name, phone, address } = req.body;
  if (!name || !phone || !address) {
    return res
      .status(400)
      .json({ error: "Name, phone, and address are required" });
  }

  const newCustomer = {
    id: generateId(),
    name,
    phone,
    address,
    createdAt: new Date().toISOString(),
  };

  customers.push(newCustomer);
  res.status(201).json(newCustomer);
}

function handleUpdateCustomer(req, res, id) {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Customer not found" });
  }

  customers[index] = { ...customers[index], ...req.body };
  res.json(customers[index]);
}

function handleDeleteCustomer(req, res, id) {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Customer not found" });
  }

  customers.splice(index, 1);
  res.status(204).send();
}

// Product handlers
function handleGetProducts(req, res) {
  res.json(products);
}

function handleGetProductById(req, res, id) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
}

function handleCreateProduct(req, res) {
  const { name, description, price, images, variants } = req.body;
  if (!name || !description || price === undefined) {
    return res
      .status(400)
      .json({ error: "Name, description, and price are required" });
  }

  const totalStock = variants
    ? variants.reduce((sum, variant) => sum + variant.stock, 0)
    : 0;

  const newProduct = {
    id: generateId(),
    name,
    description,
    price: parseFloat(price),
    images: Array.isArray(images) ? images : [],
    variants: Array.isArray(variants)
      ? variants.map((v) => ({
          id: v.id || generateId(),
          name: v.name,
          stock: parseInt(v.stock) || 0,
        }))
      : [],
    totalStock,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
}

function handleUpdateProduct(req, res, id) {
  const index = products.findIndex((p) => p.id === id);
  const updates = req.body;

  if (updates.price !== undefined) updates.price = parseFloat(updates.price);

  if (updates.variants) {
    updates.totalStock = updates.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0,
    );
  }

  if (index === -1) {
    // Product not found in memory (common in serverless), create it with the provided data
    const newProduct = {
      id,
      name: updates.name || "Unknown Product",
      description: updates.description || "",
      price: updates.price || 0,
      images: updates.images || [],
      category_id: updates.category_id || null,
      variants: updates.variants || [],
      total_stock: updates.total_stock || updates.totalStock || 0,
      ...updates,
    };
    products.push(newProduct);
    return res.json(newProduct);
  }

  products[index] = { ...products[index], ...updates };
  res.json(products[index]);
}

function handleDeleteProduct(req, res, id) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  products.splice(index, 1);
  res.status(204).send();
}

// Order handlers
function handleGetOrders(req, res) {
  res.json(orders);
}

function handleCreateOrder(req, res) {
  const { customerId, items, status, deliveryType, notes } = req.body;
  if (!customerId || !items || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Customer ID and items are required" });
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const newOrder = {
    id: generateId(),
    customerId,
    items,
    total,
    status: status || "processing",
    deliveryType: deliveryType || "delivery",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: notes || "",
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
}

function handleUpdateOrder(req, res, id) {
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  const updates = { ...req.body, updatedAt: new Date().toISOString() };

  if (updates.items) {
    updates.total = updates.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  orders[index] = { ...orders[index], ...updates };
  res.json(orders[index]);
}

function handleDeleteOrder(req, res, id) {
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  orders.splice(index, 1);
  res.status(204).send();
}
