'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileDown, FileUp, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function BackupPage() {
    const { toast } = useToast();

    const handleExport = () => {
        try {
            const entrepreneurs = localStorage.getItem('entrepreneurs') || '[]';
            const institutions = localStorage.getItem('institutions') || '[]';
            const user = localStorage.getItem('user') || '{}';
            
            const backupData = {
                entrepreneurs: JSON.parse(entrepreneurs),
                institutions: JSON.parse(institutions),
                user: JSON.parse(user)
            };

            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const date = format(new Date(), 'yyyy-MM-dd');
            link.download = `sipdata_backup_${date}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({
                title: 'Export Berhasil!',
                description: 'Semua data telah di-export ke dalam file JSON.',
            });

        } catch (error) {
            console.error("Failed to export data", error);
            toast({
                variant: 'destructive',
                title: 'Gagal Export Data',
                description: 'Terjadi kesalahan saat mencoba mengekspor data.',
            });
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File could not be read");
                }
                
                const importedData = JSON.parse(text);

                if (!importedData.hasOwnProperty('entrepreneurs') || !importedData.hasOwnProperty('institutions') || !importedData.hasOwnProperty('user')) {
                     toast({
                        variant: 'destructive',
                        title: 'File Backup Tidak Valid',
                        description: 'Format file tidak sesuai. Pastikan Anda mengunggah file backup yang benar.',
                    });
                    return;
                }

                localStorage.setItem('entrepreneurs', JSON.stringify(importedData.entrepreneurs));
                localStorage.setItem('institutions', JSON.stringify(importedData.institutions));
                localStorage.setItem('user', JSON.stringify(importedData.user));

                toast({
                    title: 'Import Berhasil!',
                    description: 'Data telah dipulihkan. Aplikasi akan dimuat ulang.',
                });

                // Reload the page to ensure all contexts are updated with the new data
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } catch (error) {
                 console.error("Failed to import data", error);
                toast({
                    variant: 'destructive',
                    title: 'Gagal Import Data',
                    description: 'File rusak atau bukan format JSON yang valid.',
                });
            } finally {
                // Reset file input
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">Pengaturan & Cadangan Data</h1>

            <Card className="shadow-lg border-none bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info /> Penyimpanan Otomatis</CardTitle>
                    <CardDescription>
                        Aplikasi ini dirancang untuk berjalan secara offline dan menyimpan data Anda dengan aman.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-card-foreground/90 space-y-2">
                    <p>
                        <strong className="text-primary">Penyimpanan Otomatis:</strong> Semua perubahan yang Anda buat (input data UMKM, lembaga, dan pembaruan profil) secara otomatis disimpan langsung ke penyimpanan internal browser Anda. Anda tidak perlu menekan tombol simpan.
                    </p>
                    <p>
                       <strong className="text-primary">Kapan Harus Backup Manual?</strong> Fitur "Export Data" di bawah ini berguna untuk membuat salinan file cadangan (.json) yang bisa Anda simpan di tempat lain (misal: Google Drive, Flashdisk). Lakukan ini secara berkala sebagai lapisan keamanan ekstra, terutama sebelum membersihkan data browser atau berpindah perangkat.
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileDown /> Export Data</CardTitle>
                    <CardDescription>
                        Simpan semua data aplikasi (Database Pelaku Usaha, Lembaga, dan Profil Pengguna) ke dalam satu file JSON. Simpan file ini di tempat yang aman sebagai cadangan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleExport}>
                        <FileDown className="mr-2" /> Export Semua Data
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-destructive/20 border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><FileUp /> Import Data</CardTitle>
                    <CardDescription>
                       Pulihkan data dari file backup JSON. <strong className="text-destructive">PERHATIAN:</strong> Tindakan ini akan menimpa semua data yang ada saat ini dengan data dari file backup.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Input 
                        type="file" 
                        onChange={handleImport} 
                        accept=".json"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-destructive/10 file:text-destructive hover:file:bg-destructive/20"
                    />
                </CardContent>
            </Card>
        </div>
    );
}