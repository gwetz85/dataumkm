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
  Send,
  Users,
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

const formSchema = z.object({
  nik: z.string().length(16, { message: 'NIK harus 16 digit.' }),
  kk: z.string().length(16, { message: 'Nomor KK harus 16 digit.' }),
  fullName: z.string().min(2, { message: 'Nama lengkap wajib diisi.' }),
  gender: z.enum(['Laki-laki', 'Perempuan'], {
    required_error: "Anda harus memilih jenis kelamin.",
  }),
  phoneNumber: z.string().min(10, { message: 'Masukkan nomor ponsel yang valid.' }),
  address: z.string().min(10, { message: 'Alamat lengkap wajib diisi.' }),
  businessType: z.string().min(2, { message: 'Jenis usaha wajib diisi.' }),
  businessLocation: z.string().min(2, { message: 'Lokasi usaha wajib diisi.' }),
  coordinator: z.string().min(2, { message: 'Nama koordinator wajib diisi.' }),
});

type EntrepreneurFormValues = z.infer<typeof formSchema>;

type EntrepreneurFormProps = {
  onFormSubmit: (data: EntrepreneurFormValues) => void;
  initialData?: Partial<EntrepreneurFormValues> | null;
  isEdit?: boolean;
};

export function EntrepreneurForm({ onFormSubmit, initialData, isEdit = false }: EntrepreneurFormProps) {
  const { toast } = useToast();

  const form = useForm<EntrepreneurFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nik: '',
      kk: '',
      fullName: '',
      gender: undefined,
      phoneNumber: '',
      address: '',
      businessType: '',
      businessLocation: '',
      coordinator: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else if (!isEdit) {
      form.reset({
        nik: '',
        kk: '',
        fullName: '',
        gender: undefined,
        phoneNumber: '',
        address: '',
        businessType: '',
        businessLocation: '',
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
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><User /> Informasi Pribadi</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm"><User className="w-4 h-4"/> Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="cth. Budi Santoso" {...field} />
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
                        <FormLabel className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4"/> Nomor Ponsel</FormLabel>
                        <FormControl>
                          <Input placeholder="cth. 081234567890" {...field} />
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
                        <FormLabel className="flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4"/> NIK</FormLabel>
                        <FormControl>
                          <Input placeholder="cth. 327321..." {...field} />
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
                        <FormLabel className="flex items-center gap-2 text-sm"><Hash className="w-4 h-4"/> No. KK</FormLabel>
                        <FormControl>
                          <Input placeholder="cth. 327321..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-sm"><Users className="w-4 h-4"/> Jenis Kelamin</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex items-center gap-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="Laki-laki" id="male" />
                            </FormControl>
                            <FormLabel htmlFor="male" className="font-normal cursor-pointer">Laki-laki</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="Perempuan" id="female" />
                            </FormControl>
                            <FormLabel htmlFor="female" className="font-normal cursor-pointer">Perempuan</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4"/> Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea placeholder="cth. Jl. Merdeka No. 10, Bandung" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Briefcase /> Informasi Usaha</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm"><Briefcase className="w-4 h-4"/> Jenis Usaha</FormLabel>
                        <FormControl>
                          <Input placeholder="cth. Kuliner" {...field} />
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
                        <FormLabel className="flex items-center gap-2 text-sm"><Home className="w-4 h-4"/> Lokasi Usaha</FormLabel>
                        <FormControl>
                          <Input placeholder="cth. Bandung" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
             </div>
             
             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><UserCheck /> Koordinator</h3>
                <FormField
                    control={form.control}
                    name="coordinator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm"><UserCheck className="w-4 h-4"/> Nama Koordinator</FormLabel>
                        <FormControl>
                          <Input placeholder="cth. Andi Wijaya" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
