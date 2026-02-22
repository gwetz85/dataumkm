'use client';

import * as React from 'react';
import type { Entrepreneur } from '@/lib/types';
import { useRouter } from 'next/navigation';

type EntrepreneurFormValues = Omit<Entrepreneur, 'id' | 'registrationDate' | 'barcode'>;

type EntrepreneurContextType = {
  entrepreneurs: Entrepreneur[];
  addEntrepreneur: (data: EntrepreneurFormValues) => void;
  updateEntrepreneur: (id: string, data: EntrepreneurFormValues) => void;
  deleteEntrepreneur: (id: string) => void;
  getEntrepreneurById: (id: string) => Entrepreneur | undefined;
  loading: boolean;
};

const EntrepreneurContext = React.createContext<EntrepreneurContextType | undefined>(undefined);

export function EntrepreneurProvider({ children }: { children: React.ReactNode }) {
  const [entrepreneurs, setEntrepreneurs] = React.useState<Entrepreneur[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const savedEntrepreneurs = localStorage.getItem('entrepreneurs');
      if (savedEntrepreneurs) {
        setEntrepreneurs(JSON.parse(savedEntrepreneurs));
      }
    } catch (error) {
      console.error("Failed to parse entrepreneurs from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!loading) {
        try {
            localStorage.setItem('entrepreneurs', JSON.stringify(entrepreneurs));
        } catch(error) {
            console.error("Failed to save entrepreneurs to localStorage", error);
        }
    }
  }, [entrepreneurs, loading]);

  const addEntrepreneur = (data: EntrepreneurFormValues) => {
    const newEntrepreneur: Entrepreneur = {
      ...data,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
      barcode: Math.floor(10000000 + Math.random() * 90000000).toString(),
    };
    setEntrepreneurs(prev => [newEntrepreneur, ...prev]);
    router.push('/database');
  };

  const updateEntrepreneur = (id: string, data: EntrepreneurFormValues) => {
    setEntrepreneurs(prev => 
        prev.map(e => e.id === id ? { ...e, ...data } : e)
    );
    router.push('/database');
  };

  const deleteEntrepreneur = (id: string) => {
    setEntrepreneurs(prev => prev.filter(e => e.id !== id));
  };
  
  const getEntrepreneurById = (id: string): Entrepreneur | undefined => {
      if (loading) return undefined;
      return entrepreneurs.find(e => e.id === id);
  };
  
  const value = { 
      entrepreneurs, 
      addEntrepreneur, 
      loading,
      updateEntrepreneur,
      deleteEntrepreneur,
      getEntrepreneurById
  };
  
  return (
    <EntrepreneurContext.Provider value={value}>
      {children}
    </EntrepreneurContext.Provider>
  );
}

export function useEntrepreneur() {
  const context = React.useContext(EntrepreneurContext);
  if (context === undefined) {
    throw new Error('useEntrepreneur must be used within an EntrepreneurProvider');
  }
  return context;
}
