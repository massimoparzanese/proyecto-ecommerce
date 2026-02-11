export const API_BASE =
  (import.meta.env.VITE_API_BASE as string) || 'http://localhost:4000';

export async function apiFetch(path: string, init?: RequestInit) {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string> | undefined),
    },
    ...init,
  });

  return res;
}

export default apiFetch;
