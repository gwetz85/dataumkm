'use client';

import * as React from 'react';
import { ProfileForm } from '@/components/profile-form';
import { useAuth, type UserProfile } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

export default function ProfilePage() {
    const { user, updateUserProfile, loading } = useAuth();
    
    const handleFormSubmit = (data: UserProfile) => {
        updateUserProfile(data);
    };
    
    if (loading) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold flex items-center gap-3">
                <User className="w-8 h-8" />
                Profil Pengguna
            </h1>
            <ProfileForm onFormSubmit={handleFormSubmit} initialData={user?.data} />
        </div>
    );
}
