'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Briefcase,
  User,
  Send,
  Home,
  MapPin,
  FileSignature,
  DollarSign,
  Clock
} from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { NIB } from '@/lib/types';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Nama lengkap wajib diisi.' }),
  nik: z.string().length(16, { message: 'NIK harus 16 digit.' }),
  birthPlace: z.string().min(2, { message: 'Tempat lahir wajib diisi.' }),
  birthDate: z.string().min(1, { message: 'Tanggal lahir wajib diisi.' }),
  address: z.string().min(10, { message: 'Alamat lengkap wajib diisi.' }),
  rt: z.string().min(1, { message: 'RT wajib diisi.' }),
  rw: z.string().min(1, { message: 'RW wajib diisi.' }),
  businessType: z.string().min(2, { message: 'Usaha wajib diisi.' }),
  businessName: z.string().min(2, { message: 'Nama usaha wajib diisi.' }),
  businessLocation: z.string().min(2, { message: 'Lokasi usaha wajib diisi.' }),
  businessCapital: z.string().min(1, { message: 'Modal usaha wajib diisi.' }),
  businessDuration: z.string().min(1, { message: 'Lama usaha wajib diisi.' }),
});

type NIBFormValues = z.infer<typeof formSchema>;

type NIBFormProps = {
  onFormSubmit: (data: NIBFormValues) => void;
  initialData?: NIB | null;
  isEdit?: boolean;
};

export function NIBForm({ onFormSubmit, initialData, isEdit = false }: NIBFormProps) {
  const { toast } = useToast();

  const form = useForm<NIBFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      fullName: '',
      nik: '',
      birthPlace: '',
      birthDate: '',
      address: '',
      rt: '',
      rw: '',
      businessType: '',
      businessName: '',
      businessLocation: '',
      businessCapital: '',
      businessDuration: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else if (!isEdit) {
      form.reset({
        fullName: '',
        nik: '',
        birthPlace: '',
        birthDate: '',
        address: '',
        rt: '',
        rw: '',
        businessType: '',
        businessName: '',
        businessLocation: '',
        businessCapital: '',
        businessDuration: '',
      });
    }
  }, [initialData, isEdit, form]);

  const { isSubmitting } = form.formState;

  function onSubmit(values: NIBFormValues) {
    onFormSubmit(values);
    if (isEdit) {
      toast({
        title: 'DATA TELAH DI PERBARUI',
      });
    } else {
      toast({
        title: 'Berhasil!',
        description: `Data NIB untuk ${values.fullName} telah ditambahkan.`,
      });
      form.reset();
    }
  }

  return (
    <Card className="w-full shadow-lg border-none bg-card/80">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><User /> Data Pribadi</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl><Input placeholder="cth. Budi Santoso" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="nik" render={({ field }) => (
                      <FormItem>
                          <FormLabel>NIK</FormLabel>
                          <FormControl><Input placeholder="16 digit Nomor Induk Kependudukan" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="birthPlace" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Tempat Lahir</FormLabel>
                          <FormControl><Input placeholder="cth. Bandung" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="birthDate" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Tanggal Lahir</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Alamat Lengkap</FormLabel>
                        <FormControl><Textarea placeholder="cth. Jl. Merdeka No. 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="rt" render={({ field }) => (
                        <FormItem><FormLabel>RT</FormLabel><FormControl><Input placeholder="cth. 001" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="rw" render={({ field }) => (
                        <FormItem><FormLabel>RW</FormLabel><FormControl><Input placeholder="cth. 005" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Briefcase /> Data Usaha</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="businessType" render={({ field }) => (
                      <FormItem><FormLabel>Usaha</FormLabel><FormControl><Input placeholder="cth. Kuliner" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="businessName" render={({ field }) => (
                      <FormItem><FormLabel>Nama Usaha</FormLabel><FormControl><Input placeholder="cth. Warung Makan Enak" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="businessLocation" render={({ field }) => (
                      <FormItem><FormLabel>Lokasi Usaha</FormLabel><FormControl><Input placeholder="cth. Bandung" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="businessCapital" render={({ field }) => (
                      <FormItem><FormLabel>Modal Usaha</FormLabel><FormControl><Input type="number" placeholder="cth. 5000000" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="businessDuration" render={({ field }) => (
                      <FormItem><FormLabel>Lama Usaha</FormLabel><FormControl><Input placeholder="cth. 2 Tahun" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto shadow-md" disabled={isSubmitting}>
                <Send className="mr-2" />
                {isSubmitting ? 'Memproses...' : isEdit ? 'Perbarui Data' : 'Kirim Data'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
