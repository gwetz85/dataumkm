'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

export default function InformasiVersiPage() {
    const updates = [
        "Pengecekkan data bisa menggunakan NIK Dan Nomor KK.",
        "Pengecekkan NIK akan menampilkan data dengan NIK yang sesuai.",
        "Pengecekkan Nomor KK akan menampilkan semua data yang tersinkron dengan Nomor KK tersebut.",
        "Pembatasan inputan data: system akan otomatis menolak apabila ada double input baik NIK maupun Nomor KK.",
        "Update Profile untuk memberikan generated data yang sesuai di PDF print.",
        "Semua file yang sudah di upload bisa di preview melalui Database Lembaga.",
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">Informasi Versi</h1>
            <Card className="shadow-lg border-none bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GitBranch /> Catatan Pembaruan Aplikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-card-foreground/90">
                    <ul className="list-disc space-y-3 pl-5">
                        {updates.map((update, index) => (
                            <li key={index}>
                                {update}
                            </li>
                        ))}
                    </ul>
                     <p className="font-semibold text-foreground pt-4">
                        Aplikasi akan terus dikembangkan untuk fitur-fitur selanjutnya.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
