'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Database, FileSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username wajib diisi.' }),
  password: z.string().min(1, { message: 'Password wajib diisi.' }),
});

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const success = login(values.username, values.password);
    if (!success) {
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Username atau password salah. Silakan coba lagi.',
      });
      form.reset();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
       <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary p-3 rounded-xl shadow-md inline-block">
                <Database className="h-8 w-8 text-primary-foreground" />
            </div>
          <CardTitle className="text-2xl font-headline">SIPDATA</CardTitle>
          <CardDescription>Sistem Informasi Data Terpadu</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full !mt-6" disabled={form.formState.isSubmitting}>
                <LogIn className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Memeriksa...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col items-center justify-center gap-4 pb-6">
            <div className="relative w-full flex items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground">ATAU</span>
                <div className="flex-grow border-t border-border"></div>
            </div>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/cek-data">
                    <FileSearch className="mr-2 h-4 w-4" />
                    Cek Data Publik
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
