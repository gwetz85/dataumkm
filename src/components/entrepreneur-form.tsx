'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Briefcase,
  CreditCard,
  Hash,
  Home,
  MapPin,
  Phone,
  User,
  UserCheck,
} from 'lucide-react';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Entrepreneur } from '@/lib/types';

const formSchema = z.object({
  nik: z.string().length(16, { message: 'NIK must be 16 digits.' }),
  kk: z.string().length(16, { message: 'Nomor KK must be 16 digits.' }),
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  phoneNumber: z.string().min(10, { message: 'Enter a valid phone number.' }),
  address: z.string().min(10, { message: 'Full address is required.' }),
  businessType: z.string().min(2, { message: 'Business type is required.' }),
  businessLocation: z.string().min(2, { message: 'Business location is required.' }),
  coordinator: z.string().min(2, { message: 'Coordinator name is required.' }),
});

type EntrepreneurFormValues = z.infer<typeof formSchema>;

type EntrepreneurFormProps = {
  onFormSubmit: (data: EntrepreneurFormValues) => void;
  switchToListTab: () => void;
};

export function EntrepreneurForm({ onFormSubmit, switchToListTab }: EntrepreneurFormProps) {
  const { toast } = useToast();

  const form = useForm<EntrepreneurFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nik: '',
      kk: '',
      fullName: '',
      phoneNumber: '',
      address: '',
      businessType: '',
      businessLocation: '',
      coordinator: '',
    },
  });

  function onSubmit(values: EntrepreneurFormValues) {
    onFormSubmit(values);
    toast({
      title: 'Success!',
      description: `Data for ${values.fullName} has been added.`,
    });
    form.reset();
    switchToListTab();
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Entrepreneur Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><CreditCard className="w-4 h-4"/> Nomor Induk Kependudukan (NIK)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 327321..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Hash className="w-4 h-4"/> Nomor Kartu Keluarga (KK)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 327321..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><User className="w-4 h-4"/> Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Budi Santoso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Phone className="w-4 h-4"/> Nomor Ponsel</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Jl. Merdeka No. 10, Bandung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> Usaha</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kuliner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Home className="w-4 h-4"/> Lokasi Usaha</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bandung" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="coordinator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><UserCheck className="w-4 h-4"/> Koordinator</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Andi Wijaya" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Submit Data
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
