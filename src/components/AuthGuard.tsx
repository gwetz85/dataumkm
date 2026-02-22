'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { MobileHeader } from '@/components/mobile-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
      return (
          <div className="flex min-h-screen w-full items-center justify-center">
              <Skeleton className="h-screen w-full"/>
          </div>
      );
  }

  if (!isAuthenticated && pathname !== '/login') {
    // Still loading or redirecting
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <p>Redirecting to login...</p>
        </div>
    );
  }
  
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // User is authenticated and not on login page, show the main layout
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Sidebar />
      <div className="flex flex-col md:ml-64">
        <MobileHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
