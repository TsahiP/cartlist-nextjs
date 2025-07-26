'use client';

import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
  dehydratedState?: unknown;
}

export default function ReactQueryProvider({
  children,
  dehydratedState,
}: ReactQueryProviderProps) {
  // Ensure a single QueryClient per browser tab.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Rehydrate server-fetched data */}
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
} 