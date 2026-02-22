'use client';

import * as React from 'react';
import { Header } from '@/components/header';
import { EntrepreneurDataTable } from '@/components/entrepreneur-data-table';
import { EntrepreneurForm } from '@/components/entrepreneur-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockEntrepreneurs } from '@/lib/data';
import type { Entrepreneur } from '@/lib/types';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [entrepreneurs, setEntrepreneurs] = React.useState<Entrepreneur[]>(mockEntrepreneurs);
  const [activeTab, setActiveTab] = React.useState('list');

  const addEntrepreneur = (data: Omit<Entrepreneur, 'id' | 'registrationDate'>) => {
    const newEntrepreneur: Entrepreneur = {
      ...data,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
    };
    setEntrepreneurs(prev => [newEntrepreneur, ...prev]);
  };
  
  const switchToListTab = () => {
    setActiveTab('list');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto md:mx-0">
            <TabsTrigger value="list">Data List</TabsTrigger>
            <TabsTrigger value="add">Add New Data</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <EntrepreneurDataTable data={entrepreneurs} />
          </TabsContent>
          <TabsContent value="add" className="mt-6">
            <EntrepreneurForm onFormSubmit={addEntrepreneur} switchToListTab={switchToListTab} />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  );
}
