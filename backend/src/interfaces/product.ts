export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  isActive?: boolean; // Indicates if the product is active or not
  createdAt?: Date; // Timestamp for when the product was created
  updatedAt?: Date; // Timestamp for when the product was last updated
}
