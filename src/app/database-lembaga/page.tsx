'use client';

import * as React from 'react';
import { InstitutionDataTable } from '@/components/institution-data-table';
import { useInstitution } from '@/context/InstitutionContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function DatabaseLembagaPage() {
  const { institutions, loading } = useInstitution();

  return (
    <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-headline font-bold">Database Lembaga</h1>
        </div>
        {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        ) : (
            <InstitutionDataTable data={institutions} />
        )}
    </>
  );
}
