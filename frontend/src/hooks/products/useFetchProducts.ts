import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/interfaces/product';
import apiFetch, { ApiError } from '@/utils/api';

export default function useFetchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/products', {
        signal,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Error al procesar la respuesta del servidor');
      }

      setProducts(data);
    } catch (err) {
      // Ignorar errores de cancelación (AbortError)
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      if (signal?.aborted) {
        return;
      }

      console.error('Error fetching products:', err);

      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message || 'Error al cargar productos');
      } else {
        setError('Error al cargar productos');
      }
    } finally {
      // Solo actualizar loading si no se canceló
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: () => fetchProducts(),
  };
}
