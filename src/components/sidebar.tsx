'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, LayoutDashboard, FilePlus, Users, FileSearch, LogOut, Settings, Building2, Library, Info, User, GitBranch, Sun, FileSignature, ShieldCheck } from 'lucide-react';
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const halalLinks = [
  { href: '/input-sertifikat-halal', label: 'Input Data Pengajuan', icon: FilePlus },
  { href: '/database-sertifikat-halal', label: 'Database Pengajuan', icon: Database },
];

const utilityLinks = [
  { href: '/cek-data', label: 'Cek Data', icon: FileSearch },
  { href: '/backup', label: 'Pengaturan', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { setTheme } = useTheme();

  const isDataChecker = user?.profile === 'Data Checker';

  const createLink = (link: {href: string, label: string, icon: any}) => {
    const isActive = pathname === link.href || (link.href.includes('input') && pathname.includes('input'));
    return (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-2.5 text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:translate-x-1',
          isActive && 'bg-gradient-to-r from-primary/15 to-transparent text-primary font-bold shadow-sm border-l-2 border-primary'
        )}
      >
        <link.icon className={cn("h-5 w-5 opacity-80", isActive && "opacity-100")} />
        <span className="text-sm">{link.label}</span>
      </Link>
    );
  }

  return (
    <aside className="w-64 flex-shrink-0 glass-panel bg-card/60 border-r border-white/10 fixed h-full hidden md:flex flex-col">
       <div className="flex items-center gap-3 h-20 px-6 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-4 w-12 h-12 bg-primary/20 rounded-full blur-xl -translate-y-1/2"></div>
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg relative z-10 transition-transform hover:scale-105">
            <Database className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-headline font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent tracking-tighter relative z-10">
            SiDATA
          </h1>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-4 py-6 space-y-1">
          {!isDataChecker && (
            <>
              <Link
                href="/"
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-2.5 text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:translate-x-1',
                  pathname === '/' && 'bg-gradient-to-r from-primary/15 to-transparent text-primary font-bold shadow-sm border-l-2 border-primary'
                )}
              >
                <LayoutDashboard className={cn("h-5 w-5 opacity-80", pathname === '/' && "opacity-100")} />
                <span className="text-sm">Dashboard</span>
              </Link>
              
              <Separator className="my-3" />
              <p className="px-4 text-xs text-muted-foreground font-semibold uppercase">Pembuatan NIB</p>
              {nibLinks.map(createLink)}

              <Separator className="my-3" />
              <p className="px-4 text-xs text-muted-foreground font-semibold uppercase">UMKM</p>
              {umkmLinks.map(createLink)}
              
              <Separator className="my-3" />
              <p className="px-4 text-xs text-muted-foreground font-semibold uppercase">Sertifikat Halal</p>
              {halalLinks.map(createLink)}

              <Separator className="my-3" />
              <p className="px-4 text-xs text-muted-foreground font-semibold uppercase">Lembaga</p>
              {institutionLinks.map(createLink)}
              
              <Separator className="my-3" />
            </>
          )}
          <p className="px-4 text-xs text-muted-foreground font-semibold uppercase">Utilitas</p>
          {utilityLinks.map(createLink)}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t border-white/5">
          {user && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start items-center gap-3 h-auto p-2 text-left hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
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
    </aside>
  );
}
