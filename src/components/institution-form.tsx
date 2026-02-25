'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import {
  User,
  Phone,
  Send,
  Building,
  Home,
  FileText,
  Upload,
  PlusCircle,
  Trash2,
  Users,
  X,
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
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Institution } from '@/lib/types';


const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  dataUrl: z.string(),
}).nullable().optional();

const formSchema = z.object({
  proposerName: z.string().min(2, { message: 'Nama Koordinator wajib diisi.' }),
  proposerPhoneNumber: z.string().min(10, { message: 'Kontak Koordinator tidak valid.' }),
  institutionName: z.string().min(2, { message: 'Nama Lembaga wajib diisi.' }),
  institutionAddress: z.string().min(10, { message: 'Alamat Lembaga wajib diisi.' }),
  proposalDescription: z.string().min(10, { message: 'Usulan yang diajukan wajib diisi.' }),
  
  skLembagaFile: fileSchema,
  kemenkumhamOrKemenagFile: fileSchema,
  npwpLembagaFile: fileSchema,
  suratDomisiliFile: fileSchema,
  activityPhoto: fileSchema,

  boardMembers: z.array(z.object({
      name: z.string().min(2, "Nama wajib diisi."),
      phoneNumber: z.string().min(10, "Nomor ponsel tidak valid."),
      nik: z.string().length(16, "NIK harus 16 digit."),
      address: z.string().min(10, "Alamat lengkap wajib diisi."),
      tenure: z.string().min(1, "Lama menjabat wajib diisi."),
  })).min(1, "Minimal harus ada satu penanggung jawab."),
});

type InstitutionFormValues = z.infer<typeof formSchema>;

type InstitutionFormProps = {
  onFormSubmit: (data: Omit<Institution, 'id' | 'registrationDate' | 'barcode'>) => void;
  initialData?: Partial<Institution> | null;
  isEdit?: boolean;
};

const fileFields = [
    { name: 'skLembagaFile', label: 'SK Lembaga' },
    { name: 'kemenkumhamOrKemenagFile', label: 'Akte Kemenkumham / SK Kemenag' },
    { name: 'npwpLembagaFile', label: 'NPWP Lembaga' },
    { name: 'suratDomisiliFile', label: 'Surat Domisili' },
    { name: 'activityPhoto', label: 'Foto Kegiatan / Plang Lembaga' },
] as const;

export function InstitutionForm({ onFormSubmit, initialData, isEdit = false }: InstitutionFormProps) {
  const { toast } = useToast();

  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        proposerName: '',
        proposerPhoneNumber: '',
        institutionName: '',
        institutionAddress: '',
        proposalDescription: '',
        activityPhoto: null,
        skLembagaFile: null,
        kemenkumhamOrKemenagFile: null,
        npwpLembagaFile: null,
        suratDomisiliFile: null,
        boardMembers: [{name: '', nik: '', phoneNumber: '', address: '', tenure: ''}]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "boardMembers",
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        proposerName: initialData.proposerName,
        proposerPhoneNumber: initialData.proposerPhoneNumber,
        institutionName: initialData.institutionName,
        institutionAddress: initialData.institutionAddress,
        proposalDescription: initialData.proposalDescription,
        activityPhoto: initialData.activityPhoto,
        boardMembers: initialData.boardMembers?.length ? initialData.boardMembers : [{name: '', nik: '', phoneNumber: '', address: '', tenure: ''}],
        skLembagaFile: initialData.legalities?.skLembagaFile,
        kemenkumhamOrKemenagFile: initialData.legalities?.skKemenkumhamFile,
        npwpLembagaFile: initialData.legalities?.npwpLembagaFile,
        suratDomisiliFile: initialData.legalities?.suratDomisiliFile,
      });
    } else if (!isEdit) {
      form.reset();
    }
  }, [initialData, isEdit, form]);

  const { isSubmitting } = form.formState;

  function onSubmit(values: InstitutionFormValues) {
    const dataToSubmit = {
        proposerName: values.proposerName,
        proposerPhoneNumber: values.proposerPhoneNumber,
        institutionName: values.institutionName,
        institutionAddress: values.institutionAddress,
        proposalDescription: values.proposalDescription,
        activityPhoto: values.activityPhoto,
        legalities: {
            skLembaga: !!values.skLembagaFile,
            skLembagaFile: values.skLembagaFile,
            skKemenkumham: !!values.kemenkumhamOrKemenagFile,
            skKemenkumhamFile: values.kemenkumhamOrKemenagFile,
            npwpLembaga: !!values.npwpLembagaFile,
            npwpLembagaFile: values.npwpLembagaFile,
            suratDomisili: !!values.suratDomisiliFile,
            suratDomisiliFile: values.suratDomisiliFile,
            skKemenag: false,
            skKemenagFile: null
        },
        boardMembers: values.boardMembers,
    };

    onFormSubmit(dataToSubmit);
    if (isEdit) {
      toast({
        title: 'DATA TELAH DI PERBARUI',
      });
    } else {
      toast({
        title: 'Berhasil!',
        description: `Data untuk ${values.institutionName} telah ditambahkan.`,
      });
      form.reset();
    }
  }
  
  const handleFileChange = (fieldName: keyof InstitutionFormValues, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
              const dataUrl = loadEvent.target?.result as string;
              form.setValue(fieldName, {
                  name: file.name,
                  type: file.type,
                  dataUrl: dataUrl,
              }, { shouldValidate: true });
          };
          reader.readAsDataURL(file);
      }
  };

  const FileUploader = ({ fieldName, label }: { fieldName: keyof InstitutionFormValues, label: string }) => {
      const file = form.watch(fieldName);
      return (
          <FormItem>
              <FormLabel>{label}</FormLabel>
              {file ? (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="w-4 h-4 text-muted-foreground"/>
                          <span className="truncate max-w-xs">{file.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => form.setValue(fieldName, null, { shouldValidate: true })}>
                          <X className="w-4 h-4" />
                      </Button>
                  </div>
              ) : (
                  <FormControl>
                      <div className="relative">
                          <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                              type="file" 
                              onChange={(e) => handleFileChange(fieldName, e)} 
                              accept="application/pdf,image/*" 
                              className="pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          />
                      </div>
                  </FormControl>
              )}
              <FormMessage />
          </FormItem>
      )
  };


  return (
    <Card className="w-full shadow-lg border-none bg-card/80">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><User /> Data Pengajuan</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="proposerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Koordinator</FormLabel>
                      <FormControl><Input placeholder="cth. Budi Santoso" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="proposerPhoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kontak Koordinator</FormLabel>
                      <FormControl><Input placeholder="cth. 081234567890" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Building /> Data Lembaga</h3>
                <FormField control={form.control} name="institutionName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lembaga</FormLabel>
                    <FormControl><Input placeholder="cth. Yayasan Harapan Bangsa" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="institutionAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap Lembaga</FormLabel>
                    <FormControl><Textarea placeholder="cth. Jl. Merdeka No. 10, Bandung" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="proposalDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usulan yang diajukan</FormLabel>
                    <FormControl><Textarea placeholder="Jelaskan secara singkat mengenai usulan lembaga..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Upload /> Upload Berkas</h3>
                <FormDescription>Upload dokumen dalam format PDF atau gambar. Semua berkas bersifat opsional.</FormDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fileFields.map(field => (
                     <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={() => (
                           <FileUploader fieldName={field.name} label={field.label} />
                        )}
                    />
                  ))}
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Users /> Penanggung Jawab</h3>
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                        <p className="font-medium">Penanggung Jawab {index + 1}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                             <FormField control={form.control} name={`boardMembers.${index}.name`} render={({ field }) => (
                                <FormItem><FormLabel>Nama</FormLabel><FormControl><Input placeholder="Nama Lengkap" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`boardMembers.${index}.phoneNumber`} render={({ field }) => (
                                <FormItem><FormLabel>Nomor Ponsel</FormLabel><FormControl><Input placeholder="08..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name={`boardMembers.${index}.nik`} render={({ field }) => (
                                <FormItem><FormLabel>NIK</FormLabel><FormControl><Input placeholder="16 digit NIK" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`boardMembers.${index}.tenure`} render={({ field }) => (
                                <FormItem><FormLabel>Lama Menjabat</FormLabel><FormControl><Input placeholder="cth. 2 Tahun" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="md:col-span-2">
                              <FormField control={form.control} name={`boardMembers.${index}.address`} render={({ field }) => (
                                  <FormItem><FormLabel>Alamat Lengkap</FormLabel><FormControl><Textarea placeholder="Alamat lengkap penanggung jawab" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            </div>
                        </div>
                        {fields.length > 1 && (
                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="absolute -top-3 -right-3 h-7 w-7 p-0 rounded-full">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', nik: '', phoneNumber: '', address: '', tenure: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Penanggung Jawab
                </Button>
                 <FormMessage>{form.formState.errors.boardMembers?.message}</FormMessage>
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
