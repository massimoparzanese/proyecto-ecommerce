import mongoose from 'mongoose';
import { IProduct } from '../interfaces/product';

export interface IProductDocument extends IProduct, mongoose.Document {}

const definition: mongoose.SchemaDefinition = {
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  images: [{ type: String }], // Array of image URLs
  isActive: { type: Boolean, default: true },
};

const ProductSchema = new mongoose.Schema<IProductDocument>(definition, {
  timestamps: true,
});

ProductSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);
export default ProductModel;
