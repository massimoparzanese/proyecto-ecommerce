import { Request, Response } from 'express';
import ProductModel from '../models/product';
import { NODE_ENV } from '../config';

// Get all unique categories from products
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await ProductModel.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      message: 'Error al obtener las categorías',
      ...(NODE_ENV === 'development' && { error: String(error) }),
    });
  }
};
