import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { EntrepreneurProvider } from '@/context/EntrepreneurContext';
import { Sidebar } from '@/components/sidebar';
import { MobileHeader } from '@/components/mobile-header';

export const metadata: Metadata = {
  title: 'DATABASE UMKM',
  description: 'Aplikasi input data pelaku usaha bantuan UMKM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <EntrepreneurProvider>
          <div className="flex min-h-screen w-full flex-col bg-background">
            <Sidebar />
            <div className="flex flex-col md:ml-64">
              <MobileHeader />
              <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </EntrepreneurProvider>
      </body>
    </html>
  );
}
