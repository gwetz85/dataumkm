'use client';

import * as React from 'react';
import type { Entrepreneur } from '@/lib/types';
import { useRouter } from 'next/navigation';

type EntrepreneurContextType = {
  entrepreneurs: Entrepreneur[];
  addEntrepreneur: (data: Omit<Entrepreneur, 'id' | 'registrationDate'>) => void;
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
        localStorage.setItem('entrepreneurs', JSON.stringify(entrepreneurs));
    }
  }, [entrepreneurs, loading]);

  const addEntrepreneur = (data: Omit<Entrepreneur, 'id' | 'registrationDate'>) => {
    const newEntrepreneur: Entrepreneur = {
      ...data,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
    };
    setEntrepreneurs(prev => [newEntrepreneur, ...prev]);
    router.push('/database');
  };
  
  return (
    <EntrepreneurContext.Provider value={{ entrepreneurs, addEntrepreneur, loading }}>
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
