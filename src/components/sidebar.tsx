'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, LayoutDashboard, FilePlus, Users, FileSearch, LogOut, ArrowRightLeft, Building2, Library, Info, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const createLink = (link: {href: string, label: string, icon: any}) => {
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
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r fixed h-full hidden md:flex flex-col">
       <div className="flex items-center gap-3 h-20 px-6 border-b">
          <div className="bg-primary p-3 rounded-xl shadow-md">
            <Database className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-headline font-bold text-primary tracking-tighter">
            DATABASE
          </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 rounded-lg px-4 py-3 text-card-foreground transition-all hover:bg-primary/10 hover:text-primary',
            pathname === '/' && 'bg-primary/20 text-primary font-bold'
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        
        <Separator className="my-3" />
        <p className="px-4 text-xs text-muted-foreground font-semibold uppercase">UMKM</p>
        {umkmLinks.map(createLink)}

        <Separator className="my-3" />
        <p className="px-4 text-xs text-muted-foreground font-semibold uppercase">Lembaga</p>
        {institutionLinks.map(createLink)}
        
        <Separator className="my-3" />
        <p className="px-4 text-xs text-muted-foreground font-semibold uppercase">Utilitas</p>
        {utilityLinks.map(createLink)}
      </nav>
      <div className="mt-auto p-4 border-t">
          {user && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start items-center gap-3 h-auto p-2 text-left">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/20 text-primary font-bold capitalize">
                            {user.username.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-bold capitalize text-card-foreground">{user.username}</p>
                            <p className="text-xs text-muted-foreground">{user.profile}</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                    <DropdownMenuItem asChild>
                        <Link href="/profil" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/tentang" className="cursor-pointer">
                            <Info className="mr-2 h-4 w-4" />
                            <span>Tentang</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          )}
      </div>
    </aside>
  );
}
