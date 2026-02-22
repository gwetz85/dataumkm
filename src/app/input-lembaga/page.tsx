'use client';

import * as React from 'react';
import { InstitutionForm } from '@/components/institution-form';
import { useInstitution } from '@/context/InstitutionContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function InputLembagaPage() {
    const { addInstitution, updateInstitution, getInstitutionById, loading } = useInstitution();
    const searchParams = useSearchParams();
    const router = useRouter();
    const institutionId = searchParams.get('id');

    const [initialData, setInitialData] = React.useState<any>(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [isLoadingData, setIsLoadingData] = React.useState(true);


    React.useEffect(() => {
        if (institutionId && !loading) {
            setIsLoadingData(true);
            const data = getInstitutionById(institutionId);
            if (data) {
                setInitialData(data);
                setIsEdit(true);
            } else {
                router.push('/database-lembaga');
            }
            setIsLoadingData(false);
        } else if (!institutionId) {
            setIsEdit(false);
            setInitialData(null);
            setIsLoadingData(false);
        }
    }, [institutionId, getInstitutionById, loading, router]);

    const handleFormSubmit = (data: any) => {
        if (isEdit && institutionId) {
            updateInstitution(institutionId, data);
        } else {
            addInstitution(data);
        }
    };
    
    if (isLoadingData || (institutionId && loading)) {
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
                <h1 className="text-3xl font-headline font-bold">{isEdit ? 'Edit Data Lembaga' : 'Input Data Lembaga'}</h1>
            </div>
            <InstitutionForm onFormSubmit={handleFormSubmit} initialData={initialData} isEdit={isEdit} />
        </>
    );
}
