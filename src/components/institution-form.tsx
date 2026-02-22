'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import {
  Briefcase,
  Home,
  Phone,
  User,
  Send,
  Building,
  Library,
  Trash2,
  PlusCircle,
  FileText,
  Users,
  X,
  Upload,
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
import { Checkbox } from '@/components/ui/checkbox';
import type { LegalityFile } from '@/lib/types';
import { cn } from '@/lib/utils';


const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  dataUrl: z.string(),
}).nullable().optional();

const legalitySchema = z.object({
    skLembaga: z.boolean().default(false),
    skLembagaFile: fileSchema,
    skKemenkumham: z.boolean().default(false),
    skKemenkumhamFile: fileSchema,
    npwpLembaga: z.boolean().default(false),
    npwpLembagaFile: fileSchema,
    skKemenag: z.boolean().default(false),
    skKemenagFile: fileSchema,
    suratDomisili: z.boolean().default(false),
    suratDomisiliFile: fileSchema,
}).refine(data => !data.skLembaga || !!data.skLembagaFile, {
    message: "Berkas SK Lembaga wajib di-upload.",
    path: ["skLembagaFile"],
}).refine(data => !data.skKemenkumham || !!data.skKemenkumhamFile, {
    message: "Berkas SK Kemenkumham wajib di-upload.",
    path: ["skKemenkumhamFile"],
}).refine(data => !data.npwpLembaga || !!data.npwpLembagaFile, {
    message: "Berkas NPWP Lembaga wajib di-upload.",
    path: ["npwpLembagaFile"],
}).refine(data => !data.skKemenag || !!data.skKemenagFile, {
    message: "Berkas SK Kemenag wajib di-upload.",
    path: ["skKemenagFile"],
}).refine(data => !data.suratDomisili || !!data.suratDomisiliFile, {
    message: "Berkas Surat Domisili wajib di-upload.",
    path: ["suratDomisiliFile"],
});


const formSchema = z.object({
  proposerName: z.string().min(2, { message: 'Nama pengusul wajib diisi.' }),
  proposerPhoneNumber: z.string().min(10, { message: 'Masukkan nomor ponsel yang valid.' }),
  institutionName: z.string().min(2, { message: 'Nama lembaga wajib diisi.' }),
  institutionAddress: z.string().min(10, { message: 'Alamat lembaga wajib diisi.' }),
  legalities: legalitySchema,
  boardMembers: z.array(z.object({
      name: z.string().min(2, "Nama pengurus wajib diisi."),
      nik: z.string().length(16, "NIK harus 16 digit."),
      phoneNumber: z.string().min(10, "Nomor ponsel tidak valid."),
      position: z.string().min(2, "Jabatan wajib diisi."),
  })).min(1, "Minimal harus ada satu pengurus."),
});

type InstitutionFormValues = z.infer<typeof formSchema>;

type InstitutionFormProps = {
  onFormSubmit: (data: InstitutionFormValues) => void;
  initialData?: Partial<InstitutionFormValues> | null;
  isEdit?: boolean;
};

const legalityFields = [
    { id: 'skLembaga', label: 'SK Lembaga' },
    { id: 'skKemenkumham', label: 'SK Kemenkumham' },
    { id: 'npwpLembaga', label: 'NPWP Lembaga' },
    { id: 'skKemenag', label: 'SK Kemenag' },
    { id: 'suratDomisili', label: 'Surat Domisili' },
] as const;


export function InstitutionForm({ onFormSubmit, initialData, isEdit = false }: InstitutionFormProps) {
  const { toast } = useToast();

  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        proposerName: '',
        proposerPhoneNumber: '',
        institutionName: '',
        institutionAddress: '',
        legalities: {
            skLembaga: false,
            skLembagaFile: null,
            skKemenkumham: false,
            skKemenkumhamFile: null,
            npwpLembaga: false,
            npwpLembagaFile: null,
            skKemenag: false,
            skKemenagFile: null,
            suratDomisili: false,
            suratDomisiliFile: null,
        },
        boardMembers: [{name: '', nik: '', phoneNumber: '', position: ''}]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "boardMembers",
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else if (!isEdit) {
      form.reset({
        proposerName: '',
        proposerPhoneNumber: '',
        institutionName: '',
        institutionAddress: '',
        legalities: {
            skLembaga: false,
            skLembagaFile: null,
            skKemenkumham: false,
            skKemenkumhamFile: null,
            npwpLembaga: false,
            npwpLembagaFile: null,
            skKemenag: false,
            skKemenagFile: null,
            suratDomisili: false,
            suratDomisiliFile: null,
        },
        boardMembers: [{name: '', nik: '', phoneNumber: '', position: ''}]
      });
    }
  }, [initialData, isEdit, form]);

  const { watch } = form;
  const { isSubmitting } = form.formState;
  const watchedLegalites = watch("legalities");

  function onSubmit(values: InstitutionFormValues) {
    onFormSubmit(values);
    toast({
      title: isEdit ? 'Berhasil Diperbarui!' : 'Berhasil!',
      description: `Data untuk ${values.institutionName} telah ${isEdit ? 'diperbarui' : 'ditambahkan'}.`,
    });
    if (!isEdit) {
      form.reset();
    }
  }

  const handleFileChange = (fieldName: keyof z.infer<typeof legalitySchema>, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
              const dataUrl = loadEvent.target?.result as string;
              form.setValue(`legalities.${fieldName}`, {
                  name: file.name,
                  type: file.type,
                  dataUrl: dataUrl,
              }, { shouldValidate: true });
          };
          reader.readAsDataURL(file);
      }
  };

  const LegalityUploader = ({ fieldName, label }: { fieldName: keyof z.infer<typeof legalitySchema>, label: string }) => {
      const isChecked = watch(`legalities.${fieldName.replace('File', '') as 'skLembaga'}`);
      const file = watch(`legalities.${fieldName}`);

      if (!isChecked) return null;

      return (
        <FormItem className="mt-2 p-3 border rounded-md">
            <FormLabel>{label}</FormLabel>
            {file ? (
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="w-4 h-4 text-muted-foreground"/>
                        <span className="truncate max-w-xs">{file.name}</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => form.setValue(`legalities.${fieldName}`, null, { shouldValidate: true })}>
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
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border-none bg-card/80">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Building /> Informasi Pengusul & Lembaga</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="proposerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm"><User/> Nama Pengusul</FormLabel>
                      <FormControl><Input placeholder="cth. Budi Santoso" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="proposerPhoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm"><Phone/> Nomor Ponsel Pengusul</FormLabel>
                      <FormControl><Input placeholder="cth. 081234567890" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="institutionName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm"><Building/> Nama Lembaga</FormLabel>
                    <FormControl><Input placeholder="cth. Yayasan Harapan Bangsa" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="institutionAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm"><Home/> Alamat Lembaga</FormLabel>
                    <FormControl><Textarea placeholder="cth. Jl. Merdeka No. 10, Bandung" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Library /> Legalitas Lembaga</h3>
                <FormDescription>Pilih dokumen yang tersedia dan upload berkasnya.</FormDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {legalityFields.map(item => (
                        <div key={item.id}>
                            <FormField
                                control={form.control}
                                name={`legalities.${item.id}`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked)
                                                    if(!checked) {
                                                        form.setValue(`legalities.${item.id}File` as any, null);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`legalities.${item.id}File` as any}
                                render={() => (
                                    <LegalityUploader fieldName={`${item.id}File` as any} label={`Upload ${item.label}`} />
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Users /> Data Pengurus</h3>
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                        <p className="font-medium">Pengurus {index + 1}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                             <FormField control={form.control} name={`boardMembers.${index}.name`} render={({ field }) => (
                                <FormItem><FormLabel>Nama</FormLabel><FormControl><Input placeholder="Nama Lengkap" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`boardMembers.${index}.nik`} render={({ field }) => (
                                <FormItem><FormLabel>NIK</FormLabel><FormControl><Input placeholder="16 digit NIK" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`boardMembers.${index}.phoneNumber`} render={({ field }) => (
                                <FormItem><FormLabel>Nomor Ponsel</FormLabel><FormControl><Input placeholder="08..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name={`boardMembers.${index}.position`} render={({ field }) => (
                                <FormItem><FormLabel>Jabatan</FormLabel><FormControl><Input placeholder="Ketua, Bendahara, dll." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        {fields.length > 1 && (
                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="absolute -top-3 -right-3 h-7 w-7 p-0 rounded-full">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', nik: '', phoneNumber: '', position: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Pengurus
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
