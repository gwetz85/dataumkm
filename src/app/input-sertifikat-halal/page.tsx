'use client';

import * as React from 'react';
import { HalalForm } from '@/components/halal-form';
import { useHalal } from '@/context/HalalContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function InputHalalPage() {
    const { addHalalCertification, updateHalalCertification, getHalalCertificationById, loading } = useHalal();
    const searchParams = useSearchParams();
    const router = useRouter();
    const certificationId = searchParams.get('id');

    const [initialData, setInitialData] = React.useState<any>(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [isLoadingData, setIsLoadingData] = React.useState(true);


    React.useEffect(() => {
        if (certificationId && !loading) {
            setIsLoadingData(true);
            const data = getHalalCertificationById(certificationId);
            if (data) {
                setInitialData(data);
                setIsEdit(true);
            } else {
                router.push('/database-sertifikat-halal');
            }
            setIsLoadingData(false);
        } else if (!certificationId) {
            setIsEdit(false);
            setInitialData(null);
            setIsLoadingData(false);
        }
    }, [certificationId, getHalalCertificationById, loading, router]);

    const handleFormSubmit = (data: any) => {
        if (isEdit && certificationId) {
            updateHalalCertification(certificationId, data);
        } else {
            addHalalCertification(data);
        }
    };
    
    if (isLoadingData || (certificationId && loading)) {
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
                <h1 className="text-3xl font-headline font-bold">{isEdit ? 'Edit Pengajuan Sertifikat Halal' : 'Input Data Pengajuan Sertifikat Halal'}</h1>
            </div>
            <HalalForm onFormSubmit={handleFormSubmit} initialData={initialData} isEdit={isEdit} />
        </>
    );
}
