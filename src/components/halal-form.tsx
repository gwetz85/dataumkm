'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, User, Send, Building, ShieldCheck, FileText, Key, CheckSquare, Edit3 } from 'lucide-react';
import type { HalalCertification } from '@/lib/types';

const kelurahanOptions = [
    'Tanjungpinang Barat', 'Kemboja', 'Kampung Baru', 'Bukit Cermin', 
    'Tanjungpinang Kota', 'Senggarang', 'Kampung Bugis', 'Penyengat', 
    'Air Raja', 'Pinang Kencana', 'Melayu Kota Piring', 'Kampung Bulang', 
    'Batu IX', 'Tanjung Ayun Sakti', 'Dompak', 'Tanjung Unggat', 
    'Sei Jang', 'Tanjungpinang Timur'
];

const personSchema = z.object({
    name: z.string().min(2, { message: 'Nama wajib diisi.' }),
    nik: z.string().length(16, { message: 'NIK harus 16 digit.' }),
    gender: z.enum(['Laki-laki', 'Perempuan'], { required_error: 'Pilih jenis kelamin.' }),
    phoneNumber: z.string().min(10, { message: 'Nomor ponsel tidak valid.' }),
    email: z.string().email({ message: 'Email tidak valid.' }),
    address: z.string().min(10, { message: 'Alamat wajib diisi.' }),
    rt: z.string().min(1, { message: 'RT wajib diisi.' }),
    rw: z.string().min(1, { message: 'RW wajib diisi.' }),
    kelurahan: z.string({ required_error: 'Kelurahan wajib dipilih.' }),
    postalCode: z.string().min(5, { message: 'Kode pos tidak valid.' }),
});

const formSchema = z.object({
    businessOwner: personSchema,
    personInCharge: personSchema,
    factory: z.object({
        address: z.string().min(10, { message: 'Alamat pabrik wajib diisi.' }),
        rt: z.string().min(1, { message: 'RT wajib diisi.' }),
        rw: z.string().min(1, { message: 'RW wajib diisi.' }),
        kelurahan: z.string({ required_error: 'Kelurahan wajib dipilih.' }),
        postalCode: z.string().min(5, { message: 'Kode pos tidak valid.' }),
    }),
    businessActivity: z.object({
        businessName: z.string().min(2, 'Nama usaha wajib diisi.'),
        businessType: z.string().min(2, 'Jenis usaha wajib diisi.'),
        businessCapital: z.string().min(1, 'Modal usaha wajib diisi.'),
        income: z.string().min(1, 'Penghasilan wajib diisi.'),
        businessDuration: z.string().min(1, 'Lama usaha wajib diisi.'),
        productMarketing: z.string().min(2, 'Pemasaran produk wajib diisi.'),
    }),
    ingredients: z.string().min(10, 'Bahan yang digunakan wajib diisi.'),
    equipmentCleaning: z.string().min(10, 'Proses pembersihan wajib diisi.'),
    packaging: z.string().min(10, 'Informasi kemasan wajib diisi.'),
    processingMethod: z.string().min(10, 'Tata cara pengolahan wajib diisi.'),
    nibCheck: z.object({
        nibNumber: z.string().min(1, 'Nomor NIB wajib diisi.'),
        kbli: z.string().min(1, 'KBLI wajib diisi.'),
        productResult: z.string().min(2, 'Hasil produk wajib diisi.'),
    }),
    siHalalAccount: z.object({
        email: z.string().email('Email SiHalal tidak valid.'),
        password: z.string().min(1, 'Kata sandi SiHalal wajib diisi.'),
        accountStatus: z.string().min(2, 'Status akun wajib diisi.'),
    }),
});

type HalalFormValues = z.infer<typeof formSchema>;

type HalalFormProps = {
  onFormSubmit: (data: HalalFormValues) => void;
  initialData?: HalalCertification | null;
  isEdit?: boolean;
};

const SectionCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-lg font-medium text-primary flex items-center gap-2">{icon}{title}</h3>
        {children}
    </div>
);

export function HalalForm({ onFormSubmit, initialData, isEdit = false }: HalalFormProps) {
    const { toast } = useToast();

    const form = useForm<HalalFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            businessOwner: {},
            personInCharge: {},
            factory: {},
            businessActivity: {},
            ingredients: '',
            equipmentCleaning: '',
            packaging: '',
            processingMethod: '',
            nibCheck: {},
            siHalalAccount: {},
        },
    });

    React.useEffect(() => {
        if (initialData) form.reset(initialData);
    }, [initialData, form]);

    function onSubmit(values: HalalFormValues) {
        onFormSubmit(values);
        toast({
            title: isEdit ? 'DATA TELAH DIPERBARUI' : 'Berhasil!',
            description: `Data pengajuan untuk ${values.businessOwner.name} telah ${isEdit ? 'diperbarui' : 'disimpan'}.`,
        });
        if (!isEdit) form.reset();
    }

    return (
        <Card className="w-full shadow-lg border-none bg-card/80">
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <SectionCard title="Data Pelaku Usaha" icon={<User />}>
                            <PersonFields form={form} fieldName="businessOwner" />
                        </SectionCard>

                        <SectionCard title="Data Penanggung Jawab" icon={<User />}>
                            <PersonFields form={form} fieldName="personInCharge" />
                        </SectionCard>

                        <SectionCard title="Data Pabrik" icon={<Building />}>
                            <div className="grid md:grid-cols-1 gap-4">
                                <FormField control={form.control} name="factory.address" render={({ field }) => (
                                    <FormItem><FormLabel>Alamat Lengkap</FormLabel><FormControl><Textarea placeholder="Alamat lengkap pabrik" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="grid md:grid-cols-4 gap-4">
                                <FormField control={form.control} name="factory.rt" render={({ field }) => (
                                    <FormItem><FormLabel>RT</FormLabel><FormControl><Input placeholder="001" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="factory.rw" render={({ field }) => (
                                    <FormItem><FormLabel>RW</FormLabel><FormControl><Input placeholder="005" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="factory.kelurahan" render={({ field }) => (
                                    <FormItem><FormLabel>Kelurahan</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kelurahan" /></SelectTrigger></FormControl>
                                            <SelectContent>{kelurahanOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                        </Select><FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="factory.postalCode" render={({ field }) => (
                                    <FormItem><FormLabel>Kode Pos</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Data Kegiatan Usaha" icon={<Briefcase />}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="businessActivity.businessName" render={({ field }) => (
                                    <FormItem><FormLabel>Nama Usaha</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="businessActivity.businessType" render={({ field }) => (
                                    <FormItem><FormLabel>Jenis Usaha</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="businessActivity.businessCapital" render={({ field }) => (
                                    <FormItem><FormLabel>Modal Usaha</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="businessActivity.income" render={({ field }) => (
                                    <FormItem><FormLabel>Penghasilan</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="businessActivity.businessDuration" render={({ field }) => (
                                    <FormItem><FormLabel>Lama Usaha</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="businessActivity.productMarketing" render={({ field }) => (
                                    <FormItem><FormLabel>Pemasaran Produk</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Bahan Yang Digunakan" icon={<Edit3 />}>
                             <FormField control={form.control} name="ingredients" render={({ field }) => (
                                <FormItem><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                        </SectionCard>
                        <SectionCard title="Pembersihan Peralatan" icon={<Edit3 />}>
                             <FormField control={form.control} name="equipmentCleaning" render={({ field }) => (
                                <FormItem><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                        </SectionCard>
                        <SectionCard title="Kemasan" icon={<Edit3 />}>
                             <FormField control={form.control} name="packaging" render={({ field }) => (
                                <FormItem><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                        </SectionCard>
                         <SectionCard title="Tata Cara Pengolahan" icon={<Edit3 />}>
                             <FormField control={form.control} name="processingMethod" render={({ field }) => (
                                <FormItem><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                        </SectionCard>

                        <SectionCard title="Pemeriksaan NIB" icon={<CheckSquare />}>
                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="nibCheck.nibNumber" render={({ field }) => (
                                    <FormItem><FormLabel>Nomor NIB</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="nibCheck.kbli" render={({ field }) => (
                                    <FormItem><FormLabel>KBLI</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="nibCheck.productResult" render={({ field }) => (
                                    <FormItem><FormLabel>Hasil Produk</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Pembuatan Akun siHalal" icon={<Key />}>
                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="siHalalAccount.email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="siHalalAccount.password" render={({ field }) => (
                                    <FormItem><FormLabel>Kata Sandi</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="siHalalAccount.accountStatus" render={({ field }) => (
                                    <FormItem><FormLabel>Status Akun</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </SectionCard>
                        
                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto shadow-md" disabled={form.formState.isSubmitting}>
                                <Send className="mr-2" />
                                {form.formState.isSubmitting ? 'Memproses...' : isEdit ? 'Perbarui Data' : 'Kirim Data'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

const PersonFields = ({ form, fieldName }: { form: any, fieldName: "businessOwner" | "personInCharge" }) => {
    return (
        <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`${fieldName}.name`} render={({ field }: any) => (
                    <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input placeholder="Nama lengkap" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`${fieldName}.nik`} render={({ field }: any) => (
                    <FormItem><FormLabel>NIK</FormLabel><FormControl><Input placeholder="16 digit NIK" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`${fieldName}.gender`} render={({ field }: any) => (
                    <FormItem className="space-y-3"><FormLabel>Jenis Kelamin</FormLabel>
                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-x-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Laki-laki" id={`${fieldName}-male`} /></FormControl><FormLabel htmlFor={`${fieldName}-male`} className="font-normal cursor-pointer">Laki-laki</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Perempuan" id={`${fieldName}-female`} /></FormControl><FormLabel htmlFor={`${fieldName}-female`} className="font-normal cursor-pointer">Perempuan</FormLabel></FormItem>
                        </RadioGroup></FormControl><FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name={`${fieldName}.phoneNumber`} render={({ field }: any) => (
                    <FormItem><FormLabel>Nomor Ponsel</FormLabel><FormControl><Input placeholder="08..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
             <FormField control={form.control} name={`${fieldName}.email`} render={({ field }: any) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="email@contoh.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name={`${fieldName}.address`} render={({ field }: any) => (
                <FormItem><FormLabel>Alamat Lengkap</FormLabel><FormControl><Textarea placeholder="Alamat lengkap sesuai KTP" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid md:grid-cols-4 gap-4">
                <FormField control={form.control} name={`${fieldName}.rt`} render={({ field }: any) => (
                    <FormItem><FormLabel>RT</FormLabel><FormControl><Input placeholder="001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`${fieldName}.rw`} render={({ field }: any) => (
                    <FormItem><FormLabel>RW</FormLabel><FormControl><Input placeholder="005" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`${fieldName}.kelurahan`} render={({ field }: any) => (
                    <FormItem><FormLabel>Kelurahan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kelurahan" /></SelectTrigger></FormControl>
                            <SelectContent>{kelurahanOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name={`${fieldName}.postalCode`} render={({ field }: any) => (
                    <FormItem><FormLabel>Kode Pos</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>
    )
}
