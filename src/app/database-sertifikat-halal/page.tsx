'use client';

import * as React from 'react';
import { HalalDataTable } from '@/components/halal-data-table';
import { useHalal } from '@/context/HalalContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function DatabaseHalalPage() {
  const { halalCertifications, loading } = useHalal();

  return (
    <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-headline font-bold">Database Pengajuan Sertifikat Halal</h1>
        </div>
        {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        ) : (
            <HalalDataTable data={halalCertifications} />
        )}
    </>
  );
}
