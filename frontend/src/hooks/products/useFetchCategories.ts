import { useState, useEffect, useCallback } from 'react';
import apiFetch, { ApiError } from '@/utils/api';

export default function useFetchCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/products/categories', { signal });
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      // Ignorar errores de cancelación
      if (err.name === 'AbortError') return;

      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err.message || 'Error al cargar categorías');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchCategories(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: () => fetchCategories(),
  };
}
