'use client';

import * as React from 'react';
import { useEntrepreneur } from '@/context/EntrepreneurContext';
import { useInstitution } from '@/context/InstitutionContext';
import { Users, User, PersonStanding, Building2, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { entrepreneurs, loading: entrepreneurLoading } = useEntrepreneur();
  const { institutions, loading: institutionLoading } = useInstitution();
  
  const loading = entrepreneurLoading || institutionLoading;

  const totalData = entrepreneurs.length;
  const maleCount = entrepreneurs.filter(e => e.gender === 'Laki-laki').length;
  const femaleCount = entrepreneurs.filter(e => e.gender === 'Perempuan').length;
  const totalInstitutions = institutions.length;

  const recentActivity = React.useMemo(() => {
    if (loading) return [];
    
    const combined = [
        ...entrepreneurs.map(e => ({
            id: e.id,
            name: e.fullName,
            type: 'UMKM',
            date: new Date(e.registrationDate),
            href: `/input-data?id=${e.id}`,
            icon: <User className="h-5 w-5 text-muted-foreground" />
        })),
        ...institutions.map(i => ({
            id: i.id,
            name: i.institutionName,
            type: 'Lembaga',
            date: new Date(i.registrationDate),
            href: `/input-lembaga?id=${i.id}`,
            icon: <Building2 className="h-5 w-5 text-muted-foreground" />
        }))
    ];

    return combined
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);
  }, [entrepreneurs, institutions, loading]);


  return (
    <>
        <div className="mb-8">
            <h1 className="text-4xl font-headline font-extrabold tracking-tight text-foreground mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Ringkasan statistik data UMKM dan Lembaga.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
                <>
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </>
            ) : (
                <>
                    <Card className="glass-card bg-gradient-to-br from-card/80 to-background/50 border-white/10 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total UMKM</CardTitle>
                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-foreground group-hover:scale-105 transition-transform origin-left">{totalData}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card bg-gradient-to-br from-primary/80 to-primary/40 text-primary-foreground border-primary/50 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Laki-laki</CardTitle>
                            <div className="bg-white/20 p-2 rounded-lg">
                                <User className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold group-hover:scale-105 transition-transform origin-left">{maleCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card bg-gradient-to-br from-accent/80 to-accent/40 text-accent-foreground border-accent/50 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Perempuan</CardTitle>
                            <div className="bg-white/20 p-2 rounded-lg">
                                <PersonStanding className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold group-hover:scale-105 transition-transform origin-left">{femaleCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card bg-gradient-to-br from-card/80 to-background/50 border-white/10 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Lembaga</CardTitle>
                            <div className="bg-secondary/50 p-2 rounded-lg group-hover:bg-secondary transition-colors">
                                <Building2 className="h-5 w-5 text-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-foreground group-hover:scale-105 transition-transform origin-left">{totalInstitutions}</div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
        <div className="mt-10">
             <Card className="glass-card bg-card/60 border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl"><List className="h-6 w-6 text-primary"/> Aktivitas Terbaru</CardTitle>
                    <CardDescription className="text-sm">5 data terakhir yang ditambahkan dari UMKM dan Lembaga.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="space-y-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                        </div>
                    ) : recentActivity.length > 0 ? (
                        <div className="space-y-3">
                            {recentActivity.map((item) => (
                                <Link href={item.href} key={item.id} className="block group">
                                    <div className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-muted/80 hover:shadow-sm border border-transparent hover:border-border">
                                        <div className="bg-background border border-border/50 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
                                                <span className="bg-secondary px-2 py-0.5 rounded-md text-xs">{item.type}</span> 
                                                <span className="text-xs opacity-70">&bull; {formatDistanceToNow(item.date, { addSuffix: true })}</span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                            <List className="h-10 w-10 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground font-medium">Belum ada aktivitas.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </>
  );
}
