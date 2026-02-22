'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, LayoutDashboard, FilePlus, Users, FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/input-data', label: 'Input Data', icon: FilePlus },
  { href: '/database', label: 'Database', icon: Users },
  { href: '/cek-data', label: 'Cek Data', icon: FileSearch },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r fixed h-full hidden md:flex flex-col">
       <div className="flex items-center gap-3 h-20 px-6 border-b">
          <div className="bg-primary p-3 rounded-xl shadow-md">
            <Database className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-headline font-bold text-primary tracking-tighter">
            DATABASE UMKM
          </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-card-foreground transition-all hover:bg-primary/10 hover:text-primary',
                isActive && 'bg-primary/20 text-primary font-bold'
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
