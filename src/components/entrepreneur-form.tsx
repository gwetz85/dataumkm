'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Briefcase,
  User,
  UserCheck,
  Send,
  Users,
  Calendar,
  Home,
  MapPin,
  Landmark,
  Building2,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Entrepreneur } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const kelurahanOptions = [
    'Tanjungpinang Barat', 'Kemboja', 'Kampung Baru', 'Bukit Cermin', 
    'Tanjungpinang Kota', 'Senggarang', 'Kampung Bugis', 'Penyengat', 
    'Air Raja', 'Pinang Kencana', 'Melayu Kota Piring', 'Kampung Bulang', 
    'Batu IX', 'Tanjung Ayun Sakti', 'Dompak', 'Tanjung Unggat', 
    'Sei Jang', 'Tanjungpinang Timur'
];

const kecamatanOptions = [
    'Tanjungpinang Kota', 'Tanjungpinang Barat', 'Tanjungpinang Timur', 'Bukit Bestari'
];

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Nama lengkap wajib diisi.' }),
  gender: z.enum(['Laki-laki', 'Perempuan'], {
    required_error: "Anda harus memilih jenis kelamin.",
  }),
  birthPlace: z.string().min(2, { message: 'Tempat lahir wajib diisi.' }),
  birthDate: z.string().min(1, { message: 'Tanggal lahir wajib diisi.' }),
  address: z.string().min(10, { message: 'Alamat lengkap wajib diisi.' }),
  rt: z.string().min(1, { message: 'RT wajib diisi.' }),
  rw: z.string().min(1, { message: 'RW wajib diisi.' }),
  kelurahan: z.string({ required_error: 'Kelurahan wajib dipilih.' }),
  kecamatan: z.string({ required_error: 'Kecamatan wajib dipilih.' }),
  businessType: z.string().min(2, { message: 'Jenis usaha wajib diisi.' }),
  businessLocation: z.string().min(2, { message: 'Lokasi usaha wajib diisi.' }),
  accountNumber: z.string().min(5, { message: 'Nomor rekening minimal 5 karakter.' }).optional().or(z.literal('')),
  bankName: z.string().min(2, { message: 'Nama bank minimal 2 karakter.' }).optional().or(z.literal('')),
  coordinator: z.string().min(2, { message: 'Nama koordinator wajib diisi.' }),
});

type EntrepreneurFormValues = z.infer<typeof formSchema>;

type EntrepreneurFormProps = {
  onFormSubmit: (data: EntrepreneurFormValues) => void;
  initialData?: Entrepreneur | null;
  isEdit?: boolean;
};

export function EntrepreneurForm({ onFormSubmit, initialData, isEdit = false }: EntrepreneurFormProps) {
  const { toast } = useToast();

  const form = useForm<EntrepreneurFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      fullName: '',
      gender: undefined,
      birthPlace: '',
      birthDate: '',
      address: '',
      rt: '',
      rw: '',
      kelurahan: undefined,
      kecamatan: undefined,
      businessType: '',
      businessLocation: '',
      accountNumber: '',
      bankName: '',
      coordinator: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else if (!isEdit) {
      form.reset({
        fullName: '',
        gender: undefined,
        birthPlace: '',
        birthDate: '',
        address: '',
        rt: '',
        rw: '',
        kelurahan: undefined,
        kecamatan: undefined,
        businessType: '',
        businessLocation: '',
        accountNumber: '',
        bankName: '',
        coordinator: '',
      });
    }
  }, [initialData, isEdit, form]);

  const { isSubmitting } = form.formState;

  function onSubmit(values: EntrepreneurFormValues) {
    onFormSubmit(values);
    toast({
      title: isEdit ? 'Berhasil Diperbarui!' : 'Berhasil!',
      description: `Data untuk ${values.fullName} telah ${isEdit ? 'diperbarui' : 'ditambahkan'}.`,
    });
    if (!isEdit) {
      form.reset();
    }
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border-none bg-card/80">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Data Pelaku Usaha */}
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><User /> Data Pelaku Usaha</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl><Input placeholder="cth. Budi Santoso" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-x-4">
                          <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="Laki-laki" id="male" /></FormControl>
                            <FormLabel htmlFor="male" className="font-normal cursor-pointer">Laki-laki</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="Perempuan" id="female" /></FormControl>
                            <FormLabel htmlFor="female" className="font-normal cursor-pointer">Perempuan</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
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
                    <FormField control={form.control} name="kelurahan" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Kelurahan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Pilih Kelurahan" /></SelectTrigger></FormControl>
                              <SelectContent>{kelurahanOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="kecamatan" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Kecamatan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Pilih Kecamatan" /></SelectTrigger></FormControl>
                              <SelectContent>{kecamatanOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )} />
                </div>
            </div>

            {/* Data Usaha */}
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Briefcase /> Data Usaha</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="businessType" render={({ field }) => (
                      <FormItem><FormLabel>Jenis Usaha</FormLabel><FormControl><Input placeholder="cth. Kuliner" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="businessLocation" render={({ field }) => (
                      <FormItem><FormLabel>Lokasi Usaha</FormLabel><FormControl><Input placeholder="cth. Bandung" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
            </div>
             
            {/* Data Rekening */}
            {isEdit && (
              <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Landmark /> Data Rekening</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="accountNumber" render={({ field }) => (
                        <FormItem><FormLabel>Nomor Rekening</FormLabel><FormControl><Input placeholder="cth. 1234567890" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bankName" render={({ field }) => (
                        <FormItem><FormLabel>Nama Bank</FormLabel><FormControl><Input placeholder="cth. Bank ABC" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
              </div>
            )}

            {/* Koordinator */}
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><UserCheck /> Koordinator</h3>
                <FormField control={form.control} name="coordinator" render={({ field }) => (
                    <FormItem><FormLabel>Nama Koordinator</FormLabel><FormControl><Input placeholder="cth. Andi Wijaya" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
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
