'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { PanelLeft, Database, LayoutDashboard, FilePlus, Users, FileSearch, LogOut, ArrowRightLeft, Building2, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
];

const umkmLinks = [
  { href: '/input-data', label: 'Input Data UMKM', icon: FilePlus },
  { href: '/database', label: 'Database UMKM', icon: Users },
];

const institutionLinks = [
  { href: '/input-lembaga', label: 'Input Lembaga', icon: Building2 },
  { href: '/database-lembaga', label: 'Database Lembaga', icon: Library },
]

const utilityLinks = [
  { href: '/cek-data', label: 'Cek Data', icon: FileSearch },
  { href: '/backup', label: 'Backup & Restore', icon: ArrowRightLeft },
];

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuth();

  const createLink = (link: {href: string, label: string, icon: any}) => {
    const isActive = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setOpen(false)}
        className={cn(
            'flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground transition-all hover:text-foreground',
            isActive && 'bg-muted text-foreground'
        )}
        >
            <link.icon className="h-5 w-5" />
            {link.label}
        </Link>
    );
  }

  return (
    <header className="md:hidden bg-card border-b shadow-sm sticky top-0 z-50 flex h-20 items-center gap-4 px-4 sm:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0 flex flex-col">
                <div className="flex items-center gap-3 h-20 px-6 border-b">
                    <div className="bg-primary p-3 rounded-xl shadow-md">
                        <Database className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-headline font-bold text-primary tracking-tighter">
                        DATABASE
                    </h1>
                </div>
                <nav className="grid gap-1 text-lg font-medium p-4">
                     {navLinks.map(createLink)}
                     <Separator className="my-2" />
                     <p className="px-3 text-sm text-muted-foreground font-semibold uppercase">UMKM</p>
                     {umkmLinks.map(createLink)}
                     <Separator className="my-2" />
                     <p className="px-3 text-sm text-muted-foreground font-semibold uppercase">Lembaga</p>
                     {institutionLinks.map(createLink)}
                     <Separator className="my-2" />
                     <p className="px-3 text-sm text-muted-foreground font-semibold uppercase">Utilitas</p>
                     {utilityLinks.map(createLink)}
                </nav>
                <div className="mt-auto p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { logout(); setOpen(false); }}>
                        <LogOut className="mr-4 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
         <div className="flex items-center gap-3">
            <h1 className="text-xl font-headline font-bold text-primary tracking-tighter">
              DATABASE
            </h1>
        </div>
    </header>
  );
}
