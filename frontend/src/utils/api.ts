export const API_BASE =
  (import.meta.env.VITE_API_BASE as string) || 'http://localhost:4000';

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Enhanced API fetch with error handling and interceptors
export async function apiFetch(path: string, init?: RequestInit) {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...(init?.headers as Record<string, string> | undefined),
  };

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      credentials: init?.credentials || 'include', // Include credentials by default
    });

    // Handle HTTP errors
    if (!res.ok) {
      let errorMessage = `Error ${res.status}: ${res.statusText}`;
      let errorData;

      try {
        errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
      }

      throw new ApiError(res.status, errorMessage, errorData);
    }

    return res;
  } catch (error: any) {
    // Handle abort errors (don't convert to ApiError)
    if (error.name === 'AbortError') {
      throw error; // Re-throw as is
    }

    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(0, 'Error de red. Verifica tu conexión.');
    }

    // Handle other errors
    throw new ApiError(500, 'Error inesperado al conectar con el servidor.');
  }
}

export default apiFetch;
