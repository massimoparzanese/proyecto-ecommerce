import { useState, useEffect } from 'react';
import apiFetch, { ApiError } from '@/utils/api';
import type {
  ProductFormData,
  UseFetchProductReturn,
} from '@/interfaces/product';

/**
 * Hook para cargar los datos de un producto existente
 * @param productId - ID del producto a cargar (undefined para crear nuevo)
 */
export default function useFetchProduct(
  productId?: string
): UseFetchProductReturn {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [''],
  });
  const [isLoading, setIsLoading] = useState(Boolean(productId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay productId, es modo crear - no hay nada que cargar
    if (!productId) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiFetch(`/products/${productId}`);
        const product = await response.json();

        // Pre-llenar el formulario con los datos del producto
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          stock: product.stock.toString(),
          images: product.images.length > 0 ? product.images : [''],
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Error al cargar el producto');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { formData, isLoading, error };
}
