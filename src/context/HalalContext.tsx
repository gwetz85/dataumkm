'use client';

import * as React from 'react';
import type { HalalCertification } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

type HalalFormValues = Omit<HalalCertification, 'id' | 'registrationDate' | 'barcode'>;

type HalalContextType = {
  halalCertifications: HalalCertification[];
  addHalalCertification: (data: HalalFormValues) => void;
  updateHalalCertification: (id: string, data: HalalFormValues) => void;
  deleteHalalCertification: (id: string) => void;
  getHalalCertificationById: (id: string) => HalalCertification | undefined;
  loading: boolean;
};

const HalalContext = React.createContext<HalalContextType | undefined>(undefined);

export function HalalProvider({ children }: { children: React.ReactNode }) {
  const [halalCertifications, setHalalCertifications] = React.useState<HalalCertification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('halal_certifications');
      if (savedData) {
        setHalalCertifications(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to parse halal certifications from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!loading) {
        try {
            localStorage.setItem('halal_certifications', JSON.stringify(halalCertifications));
        } catch(error) {
            console.error("Failed to save halal certifications to localStorage", error);
        }
    }
  }, [halalCertifications, loading]);

  const addHalalCertification = (data: HalalFormValues) => {
    const newCertification: HalalCertification = {
      ...data,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
      barcode: Math.floor(10000000 + Math.random() * 90000000).toString(),
    };
    setHalalCertifications(prev => [newCertification, ...prev]);
    router.push('/database-sertifikat-halal');
  };

  const updateHalalCertification = (id: string, data: HalalFormValues) => {
    setHalalCertifications(prev => 
        prev.map(e => e.id === id ? { ...e, ...data, id: e.id, barcode: e.barcode, registrationDate: e.registrationDate } : e)
    );
    router.push('/database-sertifikat-halal');
  };

  const deleteHalalCertification = (id: string) => {
    setHalalCertifications(prev => prev.filter(e => e.id !== id));
    toast({
        title: "DATA BERHASIL DI HAPUS",
    });
  };
  
  const getHalalCertificationById = (id: string): HalalCertification | undefined => {
      if (loading) return undefined;
      return halalCertifications.find(e => e.id === id);
  };
  
  const value = { 
      halalCertifications, 
      addHalalCertification, 
      loading,
      updateHalalCertification,
      deleteHalalCertification,
      getHalalCertificationById
  };
  
  return (
    <HalalContext.Provider value={value}>
      {children}
    </HalalContext.Provider>
  );
}

export function useHalal() {
  const context = React.useContext(HalalContext);
  if (context === undefined) {
    throw new Error('useHalal must be used within a HalalProvider');
  }
  return context;
}
