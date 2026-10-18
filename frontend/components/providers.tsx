'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { refreshSession } from '@/lib/api';
import { MotionProvider } from '@/lib/motion';

/** Restores the in-memory access token from the refresh cookie once per page load. */
function SessionBootstrap() {
  useEffect(() => {
    void refreshSession();
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } } }),
  );
  return (
    <QueryClientProvider client={client}>
      <MotionProvider>
        <SessionBootstrap />
        {children}
      </MotionProvider>
    </QueryClientProvider>
  );
}
