'use client';

import * as React from 'react';
import { EntrepreneurDataTable } from '@/components/entrepreneur-data-table';
import { useEntrepreneur } from '@/context/EntrepreneurContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';


export default function DatabasePage() {
  const { entrepreneurs, loading } = useEntrepreneur();

  return (
    <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-headline font-bold">Entrepreneur Database</h1>
            <Button asChild className="shadow-md w-full md:w-auto">
                <Link href="/input-data">
                    <PlusCircle className="mr-2" />
                    Add New Data
                </Link>
            </Button>
        </div>
        {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        ) : (
            <EntrepreneurDataTable data={entrepreneurs} />
        )}
    </>
  );
}
