import { RequestHandler } from "express";
import { categoryDb, Category } from "../lib/supabase";

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const getAllCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await categoryDb.getAll();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Name is required" });
    }

    const newCategory = {
      name: name.trim(),
    };

    const createdCategory = await categoryDb.create(newCategory);
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Updating category with ID:", id);
    console.log("Update data:", updates);

    if (!id) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const updatedCategory = await categoryDb.update(id, updates);
    console.log("Category updated successfully:", updatedCategory.id);
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error) {
      if (
        error.message.includes("No rows") ||
        error.message.includes("Category not found")
      ) {
        res.status(404).json({ error: "Category not found" });
      } else {
        res
          .status(500)
          .json({ error: `Failed to update category: ${error.message}` });
      }
    } else {
      res
        .status(500)
        .json({ error: "Failed to update category: Unknown error" });
    }
  }
};

export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryDb.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error instanceof Error && error.message.includes("No rows")) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(500).json({ error: "Failed to delete category" });
    }
  }
};

export const getCategoryById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryDb.getById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};
