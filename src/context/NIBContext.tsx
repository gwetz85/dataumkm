'use client';

import * as React from 'react';
import type { NIB } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

type NIBFormValues = Omit<NIB, 'id' | 'registrationDate' | 'barcode'>;

type NIBContextType = {
  nibs: NIB[];
  addNIB: (data: NIBFormValues) => void;
  updateNIB: (id: string, data: NIBFormValues) => void;
  deleteNIB: (id: string) => void;
  getNIBById: (id: string) => NIB | undefined;
  loading: boolean;
};

const NIBContext = React.createContext<NIBContextType | undefined>(undefined);

export function NIBProvider({ children }: { children: React.ReactNode }) {
  const [nibs, setNibs] = React.useState<NIB[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const savedNIBs = localStorage.getItem('nibs');
      if (savedNIBs) {
        setNibs(JSON.parse(savedNIBs));
      }
    } catch (error) {
      console.error("Failed to parse NIBs from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!loading) {
        try {
            localStorage.setItem('nibs', JSON.stringify(nibs));
        } catch(error) {
            console.error("Failed to save NIBs to localStorage", error);
        }
    }
  }, [nibs, loading]);

  const addNIB = (data: NIBFormValues) => {
    const newNIB: NIB = {
      ...data,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
      barcode: Math.floor(10000000 + Math.random() * 90000000).toString(),
    };
    setNibs(prev => [newNIB, ...prev]);
    router.push('/database-nib');
  };

  const updateNIB = (id: string, data: NIBFormValues) => {
    setNibs(prev => 
        prev.map(e => e.id === id ? { ...e, ...data } : e)
    );
    router.push('/database-nib');
  };

  const deleteNIB = (id: string) => {
    setNibs(prev => prev.filter(e => e.id !== id));
    toast({
        title: "DATA BERHASIL DI HAPUS",
    });
  };
  
  const getNIBById = (id: string): NIB | undefined => {
      if (loading) return undefined;
      return nibs.find(e => e.id === id);
  };
  
  const value = { 
      nibs, 
      addNIB, 
      loading,
      updateNIB,
      deleteNIB,
      getNIBById
  };
  
  return (
    <NIBContext.Provider value={value}>
      {children}
    </NIBContext.Provider>
  );
}

export function useNIB() {
  const context = React.useContext(NIBContext);
  if (context === undefined) {
    throw new Error('useNIB must be used within a NIBProvider');
  }
  return context;
}
