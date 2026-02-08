// T011: API client with JWT interceptor
// T012: Error handling and response validation

import { ErrorResponse, ApiErrorCode, HttpStatus } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get JWT token from storage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from localStorage first (fallback)
  const token = localStorage.getItem('auth_token');
  return token;
}

/**
 * Set JWT token in storage and cookie (for middleware)
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
  // Also set as cookie for middleware auth check
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

/**
 * Remove JWT token from storage and cookie
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  // Remove the cookie by setting it to expire in the past
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}

/**
 * Make authenticated API request
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Attach JWT token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with provided headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle different HTTP status codes
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        error: ApiErrorCode.SERVER_ERROR,
        message: 'Something went wrong',
        status: response.status,
      }));
      
      throw new ApiError(
        errorData.message,
        response.status,
        errorData.error,
        errorData.details
      );
    }
    
    // Parse successful response
    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network error or other error
    throw new ApiError(
      'Network error. Please check your connection.',
      0,
      ApiErrorCode.NETWORK_ERROR
    );
  }
}

/**
 * API Client with all endpoints
 */
export const apiClient = {
  // Auth endpoints
  auth: {
    register: (email: string, password: string) =>
      request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    login: (email: string, password: string) =>
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    logout: () =>
      request('/api/auth/logout', {
        method: 'POST',
      }),
  },
  
  // Task endpoints
  tasks: {
    getAll: () => request('/api/tasks', { method: 'GET' }),
    
    getOne: (id: string) => request(`/api/tasks/${id}`, { method: 'GET' }),
    
    create: (data: {
      title: string;
      description?: string | null;
      dueDate?: string | null;
      isCompleted?: boolean;
    }) =>
      request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (
      id: string,
      data: {
        title?: string;
        description?: string | null;
        dueDate?: string | null;
        isCompleted?: boolean;
      }
    ) =>
      request(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      request(`/api/tasks/${id}`, {
        method: 'DELETE',
      }),
  },
};

export default apiClient;
