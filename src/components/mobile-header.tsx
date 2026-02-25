'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { PanelLeft, Database, LayoutDashboard, FilePlus, Users, FileSearch, LogOut, Settings, Building2, Library, Info, User, GitBranch, Sun, FileSignature } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import RealTimeClock from './real-time-clock';
import { useTheme } from 'next-themes';

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

const nibLinks = [
  { href: '/input-nib', label: 'Input Data NIB', icon: FileSignature },
  { href: '/database-nib', label: 'Database NIB', icon: Database },
];

const utilityLinks = [
  { href: '/cek-data', label: 'Cek Data', icon: FileSearch },
  { href: '/backup', label: 'Pengaturan', icon: Settings },
];

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { logout, user } = useAuth();
  const { setTheme } = useTheme();

  const isDataChecker = user?.profile === 'Data Checker';

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
    <header className="md:hidden bg-card border-b shadow-sm sticky top-0 z-50 flex h-20 items-center gap-4 px-4 sm:px-6 justify-between">
        <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs p-0 flex flex-col">
                    <SheetHeader className="flex-row items-center gap-3 h-20 px-6 border-b space-y-0">
                        <div className="bg-primary p-3 rounded-xl shadow-md">
                            <Database className="h-7 w-7 text-primary-foreground" />
                        </div>
                        <SheetTitle asChild>
                            <h1 className="text-xl font-headline font-bold text-primary tracking-tighter">
                                SiDATA
                            </h1>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="grid gap-1 text-lg font-medium p-4">
                        {!isDataChecker && (
                          <>
                            {navLinks.map(createLink)}
                            <Separator className="my-2" />
                            <p className="px-3 text-sm text-muted-foreground font-semibold uppercase">UMKM</p>
                            {umkmLinks.map(createLink)}
                            <Separator className="my-2" />
                            <p className="px-3 text-sm text-muted-foreground font-semibold uppercase">Lembaga</p>
                            {institutionLinks.map(createLink)}
                            <Separator className="my-2" />
                            <p className="px-3 text-sm text-muted-foreground font-semibold uppercase">Pembuatan NIB</p>
                            {nibLinks.map(createLink)}
                            <Separator className="my-2" />
                          </>
                        )}
                        <p className="px-3 text-sm text-muted-foreground font-semibold uppercase">Utilitas</p>
                        {utilityLinks.map(createLink)}
                    </nav>
                    <div className="mt-auto p-4 border-t">
                        {user && (
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start items-center gap-4 h-auto p-3 text-left">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-primary/20 text-primary font-bold capitalize">
                                                {user.username.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium leading-none capitalize text-foreground">{user.username}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.profile}
                                            </p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profil" className="cursor-pointer" onClick={() => setOpen(false)}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Sun className="mr-2 h-4 w-4" />
                                            <span>Tema</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => setTheme('light')}>
                                                    Light Mode
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme('dark')}>
                                                    Dark Mode
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem asChild>
                                        <Link href="/tentang" className="cursor-pointer" onClick={() => setOpen(false)}>
                                            <Info className="mr-2 h-4 w-4" />
                                            <span>Tentang</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/informasi-versi" className="cursor-pointer" onClick={() => setOpen(false)}>
                                            <GitBranch className="mr-2 h-4 w-4" />
                                            <span>Informasi Versi</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { logout(); setOpen(false); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-headline font-bold text-primary tracking-tighter">
                SiDATA
                </h1>
            </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
            <RealTimeClock className="flex-shrink-0" />
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/20 text-primary font-bold capitalize">
                                    {user.username.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none capitalize">{user.username}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.profile}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profil" className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profil</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Tema</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme('light')}>
                                        Light Mode
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                                        Dark Mode
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                         <DropdownMenuItem asChild>
                            <Link href="/tentang" className="cursor-pointer">
                                <Info className="mr-2 h-4 w-4" />
                                <span>Tentang</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/informasi-versi" className="cursor-pointer">
                                <GitBranch className="mr-2 h-4 w-4" />
                                <span>Informasi Versi</span>
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
    </header>
  );
}
