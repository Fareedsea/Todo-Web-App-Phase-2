// T016: Better Auth configuration

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Re-export useful hooks and utilities
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
