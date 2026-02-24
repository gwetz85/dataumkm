'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { MobileHeader } from '@/components/mobile-header';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, LogIn } from 'lucide-react';
import RealTimeClock from './real-time-clock';

const publicPaths = ['/login', '/cek-data'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated && !publicPaths.includes(pathname)) {
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

  if (!isAuthenticated && publicPaths.includes(pathname)) {
    if (pathname === '/login') {
        return <>{children}</>;
    }
    
    if (pathname === '/cek-data') {
         return (
            <div className="flex min-h-screen w-full flex-col bg-background">
                <header className="bg-card border-b shadow-sm sticky top-0 z-50 flex h-20 items-center gap-4 px-4 sm:px-6 justify-between">
                     <div className="flex items-center gap-3">
                        <Database className="h-7 w-7 text-primary" />
                        <h1 className="text-xl font-headline font-bold text-primary tracking-tighter">
                          SIPDATA
                        </h1>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/login">
                          <LogIn className="mr-2" />
                          Login
                        </Link>
                    </Button>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                   {children}
                </main>
            </div>
        );
    }
  }

  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <p>Redirecting to login...</p>
        </div>
    );
  }
  
  // User is authenticated, show the main layout
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Sidebar />
      <RealTimeClock className="fixed top-5 right-6 z-50 hidden md:block" />
      <div className="flex flex-col md:ml-64">
        <MobileHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
