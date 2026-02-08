// T022: Setup React Query hooks

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { handleError, logError } from './error-handler';

const queryConfig: DefaultOptions = {
  queries: {
    retry: (failureCount, error) => {
      // Don't retry on authentication errors or validation errors
      const errorResult = handleError(error);
      if (!errorResult.shouldRetry) {
        return false;
      }
      // Retry up to 3 times for network/server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * Math.pow(2, attemptIndex), 10000);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: false, // Don't retry mutations by default
    onError: (error) => {
      logError(error, 'Mutation Error');
    },
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Query keys for organized cache management
export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },
} as const;
