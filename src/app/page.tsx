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
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
                <>
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </>
            ) : (
                <>
                    <Card className="bg-secondary transition-all hover:shadow-lg hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-secondary-foreground">Total Data UMKM</CardTitle>
                            <Users className="h-5 w-5 text-secondary-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-secondary-foreground">{totalData}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary text-primary-foreground transition-all hover:shadow-lg hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jumlah Laki-laki</CardTitle>
                            <User className="h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{maleCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-accent text-accent-foreground transition-all hover:shadow-lg hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jumlah Perempuan</CardTitle>
                            <PersonStanding className="h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{femaleCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Lembaga</CardTitle>
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalInstitutions}</div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
        <div className="mt-8">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><List className="h-6 w-6"/>Aktivitas Terbaru</CardTitle>
                    <CardDescription>5 data terakhir yang ditambahkan dari UMKM dan Lembaga.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="space-y-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                        </div>
                    ) : recentActivity.length > 0 ? (
                        <div className="space-y-2">
                            {recentActivity.map((item) => (
                                <Link href={item.href} key={item.id} className="block">
                                    <div className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50">
                                        <div className="bg-muted p-3 rounded-full">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold leading-tight">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.type} &bull; {formatDistanceToNow(item.date, { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-10">Belum ada aktivitas.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </>
  );
}
