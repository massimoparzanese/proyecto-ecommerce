import { Request, Response } from 'express';
import ProductModel from '../models/product';
import { IProduct } from '../interfaces/product';
import { validateProductData } from '../utils/validators';
import { NODE_ENV } from '../config';

// Get all products
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'Error al obtener los productos',
      ...(NODE_ENV === 'development' && { error: String(error) }),
    });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      message: 'Error al obtener el producto',
      ...(NODE_ENV === 'development' && { error: String(error) }),
    });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: IProduct = req.body;

    // Validate product data
    const validation = validateProductData(productData);
    if (!validation.valid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    const newProduct = new ProductModel(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      message: 'Error al crear el producto',
      ...(NODE_ENV === 'development' && { error: String(error) }),
    });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate product data
    const validation = validateProductData(req.body);
    if (!validation.valid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: 'Error al actualizar el producto',
      ...(NODE_ENV === 'development' && { error: String(error) }),
    });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      message: 'Error al eliminar el producto',
      ...(NODE_ENV === 'development' && { error: String(error) }),
    });
  }
};
