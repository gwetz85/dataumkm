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
                    <p className="font-semibold text-foreground pt-2">
                        Bantuan bisa menghubungi pembuat Aplikasi.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
