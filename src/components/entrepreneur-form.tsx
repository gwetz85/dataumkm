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
import { Card, CardContent } from '@/components/ui/card';
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
};

export function EntrepreneurForm({ onFormSubmit }: EntrepreneurFormProps) {
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

  const { isSubmitting } = form.formState;

  function onSubmit(values: EntrepreneurFormValues) {
    onFormSubmit(values);
    toast({
      title: 'Success!',
      description: `Data for ${values.fullName} has been added.`,
    });
    form.reset();
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border-none bg-card/80">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><User /> Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm"><User className="w-4 h-4"/> Full Name</FormLabel>
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
                        <FormLabel className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4"/> Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 081234567890" {...field} />
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
                        <FormLabel className="flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4"/> National ID (NIK)</FormLabel>
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
                        <FormLabel className="flex items-center gap-2 text-sm"><Hash className="w-4 h-4"/> Family Card No. (KK)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 327321..." {...field} />
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
                      <FormLabel className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4"/> Full Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g. Jl. Merdeka No. 10, Bandung" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Briefcase /> Business Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm"><Briefcase className="w-4 h-4"/> Business Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Culinary" {...field} />
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
                        <FormLabel className="flex items-center gap-2 text-sm"><Home className="w-4 h-4"/> Business Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Bandung" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
             </div>
             
             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2"><UserCheck /> Coordinator</h3>
                <FormField
                    control={form.control}
                    name="coordinator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm"><UserCheck className="w-4 h-4"/> Coordinator Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Andi Wijaya" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
             </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto shadow-md" disabled={isSubmitting}>
                <Send className="mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Data'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
