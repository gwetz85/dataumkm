'use client';

import * as React from 'react';
import { Header } from '@/components/header';
import { EntrepreneurDataTable } from '@/components/entrepreneur-data-table';
import { EntrepreneurForm } from '@/components/entrepreneur-form';
import type { Entrepreneur } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database } from 'lucide-react';

export default function Home() {
  const [entrepreneurs, setEntrepreneurs] = React.useState<Entrepreneur[]>([]);
  const [view, setView] = React.useState('list'); // 'list' or 'add'

  React.useEffect(() => {
    try {
      // Prevents SSR errors
      const savedEntrepreneurs = localStorage.getItem('entrepreneurs');
      if (savedEntrepreneurs) {
        setEntrepreneurs(JSON.parse(savedEntrepreneurs));
      }
    } catch (error) {
      console.error("Failed to parse entrepreneurs from localStorage", error);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('entrepreneurs', JSON.stringify(entrepreneurs));
  }, [entrepreneurs]);

  const addEntrepreneur = (data: Omit<Entrepreneur, 'id' | 'registrationDate'>) => {
    const newEntrepreneur: Entrepreneur = {
      ...data,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
    };
    setEntrepreneurs(prev => [newEntrepreneur, ...prev]);
    setView('list'); // Switch back to the list view after adding
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {view === 'list' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-3xl font-headline font-bold text-gray-800 dark:text-gray-100">Entrepreneur Database</h2>
              <Button onClick={() => setView('add')} className="shadow-md w-full md:w-auto">
                <PlusCircle className="mr-2" />
                Add New Data
              </Button>
            </div>
            <EntrepreneurDataTable data={entrepreneurs} />
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
               <h2 className="text-3xl font-headline font-bold text-gray-800 dark:text-gray-100">Add New Entrepreneur</h2>
               <Button onClick={() => setView('list')} variant="outline" className="shadow-md w-full md:w-auto">
                 <Database className="mr-2" />
                 View Database
               </Button>
            </div>
            <EntrepreneurForm onFormSubmit={addEntrepreneur} />
          </>
        )}
      </main>
    </div>
  );
}
