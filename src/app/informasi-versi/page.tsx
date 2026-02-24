'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

export default function InformasiVersiPage() {
    const updates = [
        "Perombakkan besar disisi Tampilan Aplikasi",
        "Penambahan Fitur Waktu yang tersinkron ke database",
        "Pencarian data lebih baik dan lebih teliti",
        "Penambahan Fitur Auto Save untuk menghilangkan kemungkinan data hilang",
        "Penambahan Update Command Terminal untuk menghapus data profil user",
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">Informasi Versi</h1>
            <Card className="shadow-lg border-none bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GitBranch /> Major Update</CardTitle>
                    <CardDescription>Versi update : 2.10.2402.2026</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-card-foreground/90">
                    <p className="font-semibold text-foreground">Catatan Pembaruan Aplikasi:</p>
                    <ul className="list-disc space-y-3 pl-5">
                        {updates.map((update, index) => (
                            <li key={index}>
                                {update}
                            </li>
                        ))}
                    </ul>
                     <p className="font-semibold text-foreground pt-4 mt-4 border-t">
                        Aplikasi akan terus dikembangkan untuk fitur-fitur selanjutnya.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
