'use client';

import * as React from 'react';
import { useEntrepreneur } from '@/context/EntrepreneurContext';
import { Users, User, PersonStanding } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { entrepreneurs, loading } = useEntrepreneur();

  const totalData = entrepreneurs.length;
  const maleCount = entrepreneurs.filter(e => e.gender === 'Laki-laki').length;
  const femaleCount = entrepreneurs.filter(e => e.gender === 'Perempuan').length;

  return (
    <>
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-3">
            {loading ? (
                <>
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </>
            ) : (
                <>
                    <Card className="bg-secondary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-secondary-foreground">Total Data</CardTitle>
                            <Users className="h-5 w-5 text-secondary-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-secondary-foreground">{totalData}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary text-primary-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jumlah Laki-laki</CardTitle>
                            <User className="h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{maleCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-accent text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jumlah Perempuan</CardTitle>
                            <PersonStanding className="h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{femaleCount}</div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Selamat Datang di DATABASE!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Aplikasi input data pelaku usaha bantuan UMKM. Gunakan navigasi untuk menambah data baru atau melihat database.
                    </p>
                </CardContent>
            </Card>
        </div>
    </>
  );
}
