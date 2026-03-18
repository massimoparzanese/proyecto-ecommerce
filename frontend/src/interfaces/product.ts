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

export interface ProductsTableProps {
  products: Product[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  isLoading?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  images: string[];
}

export interface ProductFormProps {
  formData: ProductFormData;
  categories: string[];
  categoriesLoading: boolean;
  onSubmit: (e: { preventDefault: () => void }) => void;
  onChange: (
    field: keyof Omit<ProductFormData, 'images'>,
    value: string
  ) => void;
  isNewCategory: boolean;
  onToggleNewCategory: (value: boolean) => void;
  newCategoryName: string;
  onNewCategoryChange: (value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onImageChange: (index: number, value: string) => void;
  isSubmitting?: boolean;
}

export interface UseFetchProductReturn {
  formData: ProductFormData;
  isLoading: boolean;
  error: string | null;
}
