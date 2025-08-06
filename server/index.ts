import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from "./routes/customers";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "./routes/products";
import { getAllOrders, createOrder, updateOrder, deleteOrder } from "./routes/orders";
import { uploadMiddleware, handleImageUpload, deleteImage } from "./routes/upload";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Upload routes
  app.post("/api/upload", uploadMiddleware, handleImageUpload);
  app.delete("/api/upload/:filename", deleteImage);

  // Customer routes
  app.get("/api/customers", getAllCustomers);
  app.post("/api/customers", createCustomer);
  app.put("/api/customers/:id", updateCustomer);
  app.delete("/api/customers/:id", deleteCustomer);

  // Product routes
  app.get("/api/products", getAllProducts);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);

  // Order routes
  app.get("/api/orders", getAllOrders);
  app.post("/api/orders", createOrder);
  app.put("/api/orders/:id", updateOrder);
  app.delete("/api/orders/:id", deleteOrder);

  return app;
}
