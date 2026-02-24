import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { EntrepreneurProvider } from '@/context/EntrepreneurContext';
import { InstitutionProvider } from '@/context/InstitutionContext';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { ThemeProvider } from '@/components/theme-provider';


export const metadata: Metadata = {
  title: 'SiDATA',
  description: 'Sistem Informasi Data Terpadu',
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <InstitutionProvider>
              <EntrepreneurProvider>
                  <AuthGuard>
                      {children}
                  </AuthGuard>
                  <Toaster />
              </EntrepreneurProvider>
            </InstitutionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
