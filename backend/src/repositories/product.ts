import ProductModel from '../models/product';
import { IProduct } from '../interfaces/product';

export class ProductRepository {
  async getAll() {
    return ProductModel.find();
  }

  async getById(id: string) {
    return ProductModel.findById(id);
  }

  async create(productData: IProduct) {
    const product = new ProductModel(productData);
    return product.save();
  }

  async update(id: string, productData: Partial<IProduct>) {
    return ProductModel.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id: string) {
    return ProductModel.findByIdAndDelete(id);
  }

  async getByName(name: string) {
    return ProductModel.findOne({ name });
  }
}
