'use client';

import * as React from 'react';
import { Header } from '@/components/header';
import { EntrepreneurDataTable } from '@/components/entrepreneur-data-table';
import { EntrepreneurForm } from '@/components/entrepreneur-form';
import type { Entrepreneur } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database, Users, User, PersonStanding } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  
  const totalData = entrepreneurs.length;
  const maleCount = entrepreneurs.filter(e => e.gender === 'Laki-laki').length;
  const femaleCount = entrepreneurs.filter(e => e.gender === 'Perempuan').length;


  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {view === 'list' ? (
          <>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="bg-secondary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-foreground">Total Data</CardTitle>
                        <Users className="h-5 w-5 text-secondary-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-secondary-foreground">{totalData}</div>
                    </CardContent>
                </Card>
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah Laki-laki</CardTitle>
                        <User className="h-5 w-5" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{maleCount}</div>
                    </CardContent>
                </Card>
                <Card className="bg-accent text-accent-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah Perempuan</CardTitle>
                        <PersonStanding className="h-5 w-5" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{femaleCount}</div>
                    </CardContent>
                </Card>
            </div>
          
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
