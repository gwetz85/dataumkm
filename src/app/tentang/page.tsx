'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function TentangPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">Tentang Aplikasi</h1>
            <Card className="shadow-lg border-none bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info /> Tentang Aplikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-card-foreground/80">
                    <p>
                        Ini merupakan aplikasi yang dikembangkan dan dibuat secara sederhana oleh pembuat Aplikasi.
                    </p>
                    <p>
                        Aplikasi ini berjalan secara Offline dan menggunakan Cache / Internal Storage untuk menyimpan file.
                    </p>
                    <p>
                        Pastikan selalu mengupdate dan membackup data untuk menghindari Update aplikasi secara mendadak.
                    </p>
                     <div className="text-foreground pt-2">
                        <p className="font-semibold">Permasalahan atau saran bisa menghubungi:</p>
                        <div className="mt-2 space-y-1 text-card-foreground/90">
                            <p className="font-bold">MT GROUP</p>
                            <p>Internet dan Sistem Informasi</p>
                            <p>Kontak : 0817319885 ( WA )</p>
                            <p>Email : agussuriyadipunya@gmail.com</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
