'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Home,
  Save,
  Edit
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/context/AuthContext';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Nama lengkap wajib diisi.' }).optional().or(z.literal('')),
  nik: z.string().length(16, { message: 'NIK harus 16 digit.' }).optional().or(z.literal('')),
  birthPlace: z.string().optional(),
  birthDate: z.string().optional(),
  phoneNumber: z.string().min(10, { message: 'Masukkan nomor ponsel yang valid.' }).optional(),
  email: z.string().email({ message: 'Masukkan alamat email yang valid.' }).optional().or(z.literal('')),
  address: z.string().min(10, { message: 'Alamat lengkap wajib diisi.' }).optional(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

type ProfileFormProps = {
  onFormSubmit: (data: ProfileFormValues) => void;
  initialData?: UserProfile | null;
};

export function ProfileForm({ onFormSubmit, initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const [isLocked, setIsLocked] = React.useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      if (Object.keys(initialData).length === 0) {
        // This is a new profile, unlock it for the first entry.
        setIsLocked(false);
      } else {
        // This is an existing profile, lock it.
        setIsLocked(true);
      }
    } else {
      // This case should not happen based on AuthContext, but for safety:
      setIsLocked(false);
    }
  }, [initialData, form]);

  const { isSubmitting } = form.formState;

  function onSubmit(values: ProfileFormValues) {
    onFormSubmit(values);
    toast({
      title: 'DATA TELAH DI PERBARUI',
    });
    setIsLocked(true);
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border-none bg-card/80">
        <CardHeader>
            <CardTitle>Edit Profil Pengguna</CardTitle>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><User className="w-4 h-4"/> Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Budi Santoso" {...field} value={field.value || ''} disabled={isLocked} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><CreditCard className="w-4 h-4"/> NIK</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. 327321..." {...field} value={field.value || ''} disabled={isLocked} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Home className="w-4 h-4"/> Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Bandung" {...field} value={field.value || ''} disabled={isLocked} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} disabled={isLocked}/>
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
                      <Input placeholder="cth. 081234567890" {...field} value={field.value || ''} disabled={isLocked} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Mail className="w-4 h-4"/> Email</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. budi@email.com" {...field} value={field.value || ''} disabled={isLocked} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea placeholder="cth. Jl. Merdeka No. 10, Bandung" {...field} value={field.value || ''} disabled={isLocked} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              {isLocked ? (
                <Button type="button" onClick={() => setIsLocked(false)} className="w-full md:w-auto shadow-md">
                  <Edit className="mr-2" />
                  Perbarui Data
                </Button>
              ) : (
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto shadow-md" disabled={isSubmitting}>
                  <Save className="mr-2" />
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
