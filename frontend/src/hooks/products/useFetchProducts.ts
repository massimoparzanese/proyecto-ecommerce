import { useState, useEffect } from 'react';
import type { Product } from '@/interfaces/product';
import apiFetch, { ApiError } from '@/utils/api';

export default function useFetchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFetch('/products', {
          signal: abortController.signal,
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error('Error al procesar la respuesta del servidor');
        }

        setProducts(data);
      } catch (err: any) {
        // Ignorar errores de cancelación (AbortError)
        if (err.name === 'AbortError' || abortController.signal.aborted) {
          return;
        }

        console.error('Error fetching products:', err);

        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(err.message || 'Error al cargar productos');
        }
      } finally {
        // Solo actualizar loading si no se canceló
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      abortController.abort();
    };
  }, []);

  return { products, loading, error };
}
