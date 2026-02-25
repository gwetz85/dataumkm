'use client';

import * as React from 'react';
import { NIBDataTable } from '@/components/nib-data-table';
import { useNIB } from '@/context/NIBContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function DatabaseNIBPage() {
  const { nibs, loading } = useNIB();

  return (
    <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-headline font-bold">Database Pembuatan NIB</h1>
        </div>
        {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        ) : (
            <NIBDataTable data={nibs} />
        )}
    </>
  );
}
