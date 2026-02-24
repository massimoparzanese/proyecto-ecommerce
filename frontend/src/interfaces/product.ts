export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  isActive?: boolean; // Indicates if the product is active or not
  createdAt?: Date; // Timestamp for when the product was created
  updatedAt?: Date; // Timestamp for when the product was last updated
}

export interface ProductListProps {
  products: Product[];
  searchTerm: string;
}

export interface ProductCardProps {
  product: Product;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    image: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    photos: string[];
  };
}
