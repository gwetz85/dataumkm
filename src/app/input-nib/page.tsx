'use client';

import * as React from 'react';
import { NIBForm } from '@/components/nib-form';
import { useNIB } from '@/context/NIBContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function InputNIBPage() {
    const { addNIB, updateNIB, getNIBById, loading } = useNIB();
    const searchParams = useSearchParams();
    const router = useRouter();
    const nibId = searchParams.get('id');

    const [initialData, setInitialData] = React.useState<any>(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [isLoadingData, setIsLoadingData] = React.useState(true);


    React.useEffect(() => {
        if (nibId && !loading) {
            setIsLoadingData(true);
            const data = getNIBById(nibId);
            if (data) {
                setInitialData(data);
                setIsEdit(true);
            } else {
                router.push('/database-nib');
            }
            setIsLoadingData(false);
        } else if (!nibId) {
            setIsEdit(false);
            setInitialData(null);
            setIsLoadingData(false);
        }
    }, [nibId, getNIBById, loading, router]);

    const handleFormSubmit = (data: any) => {
        if (isEdit && nibId) {
            updateNIB(nibId, data);
        } else {
            addNIB(data);
        }
    };
    
    if (isLoadingData || (nibId && loading)) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">{isEdit ? 'Edit Data NIB' : 'Input Data Pembuatan NIB'}</h1>
            </div>
            <NIBForm onFormSubmit={handleFormSubmit} initialData={initialData} isEdit={isEdit} />
        </>
    );
}
