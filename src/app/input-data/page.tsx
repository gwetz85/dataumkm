'use client';

import * as React from 'react';
import { EntrepreneurForm } from '@/components/entrepreneur-form';
import { useEntrepreneur } from '@/context/EntrepreneurContext';

export default function InputDataPage() {
    const { addEntrepreneur } = useEntrepreneur();

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">Add New Entrepreneur</h1>
            </div>
            <EntrepreneurForm onFormSubmit={addEntrepreneur} />
        </>
    );
}
