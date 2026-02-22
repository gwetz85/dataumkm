'use client';

import * as React from 'react';
import { EntrepreneurForm } from '@/components/entrepreneur-form';
import { useEntrepreneur } from '@/context/EntrepreneurContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function InputDataPage() {
    const { addEntrepreneur, updateEntrepreneur, getEntrepreneurById, loading } = useEntrepreneur();
    const searchParams = useSearchParams();
    const router = useRouter();
    const entrepreneurId = searchParams.get('id');

    const [initialData, setInitialData] = React.useState<any>(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [isLoadingData, setIsLoadingData] = React.useState(true);


    React.useEffect(() => {
        if (entrepreneurId && !loading) {
            setIsLoadingData(true);
            const data = getEntrepreneurById(entrepreneurId);
            if (data) {
                setInitialData(data);
                setIsEdit(true);
            } else {
                router.push('/database');
            }
            setIsLoadingData(false);
        } else if (!entrepreneurId) {
            setIsEdit(false);
            setInitialData(null);
            setIsLoadingData(false);
        }
    }, [entrepreneurId, getEntrepreneurById, loading, router]);

    const handleFormSubmit = (data: any) => {
        if (isEdit && entrepreneurId) {
            updateEntrepreneur(entrepreneurId, data);
        } else {
            addEntrepreneur(data);
        }
    };
    
    if (isLoadingData || (entrepreneurId && loading)) {
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
                <h1 className="text-3xl font-headline font-bold">{isEdit ? 'Edit Data Pelaku Usaha' : 'Input Data Pelaku Usaha'}</h1>
            </div>
            <EntrepreneurForm onFormSubmit={handleFormSubmit} initialData={initialData} isEdit={isEdit} />
        </>
    );
}
