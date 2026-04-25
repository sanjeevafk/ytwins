/**
 * API Client for FocusTube V3
 * Designed for same-domain deployment (no CORS/JWT needed)
 * Uses native fetch with standard session cookies.
 */

const API_BASE = '/api';

export interface ApiResponse<T> {
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  
  // Credentials 'include' ensures cookies are sent/received
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Handle unauthorized - potentially redirect to login
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      window.location.href = '/auth/google';
    }
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) => 
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data?: unknown) => 
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
  async getCurrentUser() {
    const response = await api.get<{ id: number; email: string; name: string }>('/auth/me');
    if (response.error) return null;
    return response.data;
  }
};
