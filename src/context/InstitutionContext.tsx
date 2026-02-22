'use client';

import * as React from 'react';
import type { Institution } from '@/lib/types';
import { useRouter } from 'next/navigation';

type InstitutionFormValues = Omit<Institution, 'id' | 'registrationDate' | 'barcode'>;

type InstitutionContextType = {
  institutions: Institution[];
  addInstitution: (data: InstitutionFormValues) => void;
  updateInstitution: (id: string, data: InstitutionFormValues) => void;
  deleteInstitution: (id: string) => void;
  getInstitutionById: (id: string) => Institution | undefined;
  loading: boolean;
};

const InstitutionContext = React.createContext<InstitutionContextType | undefined>(undefined);

export function InstitutionProvider({ children }: { children: React.ReactNode }) {
  const [institutions, setInstitutions] = React.useState<Institution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const savedInstitutions = localStorage.getItem('institutions');
      if (savedInstitutions) {
        setInstitutions(JSON.parse(savedInstitutions));
      }
    } catch (error) {
      console.error("Failed to parse institutions from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!loading) {
        try {
            localStorage.setItem('institutions', JSON.stringify(institutions));
        } catch(error) {
            console.error("Failed to save institutions to localStorage", error);
        }
    }
  }, [institutions, loading]);

  const addInstitution = (data: InstitutionFormValues) => {
    const newInstitution: Institution = {
      ...data,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
      barcode: Math.floor(10000000 + Math.random() * 90000000).toString(),
    };
    setInstitutions(prev => [newInstitution, ...prev]);
    router.push('/database-lembaga');
  };

  const updateInstitution = (id: string, data: InstitutionFormValues) => {
    setInstitutions(prev => 
        prev.map(e => e.id === id ? { ...e, ...data, id: e.id, registrationDate: e.registrationDate, barcode: e.barcode } : e)
    );
    router.push('/database-lembaga');
  };

  const deleteInstitution = (id: string) => {
    setInstitutions(prev => prev.filter(e => e.id !== id));
  };
  
  const getInstitutionById = (id: string): Institution | undefined => {
      if (loading) return undefined;
      return institutions.find(e => e.id === id);
  };
  
  const value = { 
      institutions, 
      addInstitution, 
      loading,
      updateInstitution,
      deleteInstitution,
      getInstitutionById
  };
  
  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitution() {
  const context = React.useContext(InstitutionContext);
  if (context === undefined) {
    throw new Error('useInstitution must be used within an InstitutionProvider');
  }
  return context;
}
