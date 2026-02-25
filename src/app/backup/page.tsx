'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileDown, FileUp, Info, RotateCcw, FileClock, Terminal } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export default function BackupPage() {
    const { toast } = useToast();
    const [lastBackupTime, setLastBackupTime] = React.useState<string | null>(null);
    const { user } = useAuth();
    const isDataChecker = user?.profile === 'Data Checker';

    React.useEffect(() => {
        const checkLastBackupTime = () => {
            const backupJson = localStorage.getItem('sipdata_autobackup');
            if (backupJson) {
                try {
                    const backup = JSON.parse(backupJson);
                    if (backup.timestamp) {
                        setLastBackupTime(backup.timestamp);
                    }
                } catch (e) {
                    console.error("Failed to parse auto-backup timestamp", e);
                }
            }
        };

        checkLastBackupTime(); // Initial check on mount
        const intervalId = setInterval(checkLastBackupTime, 5000); // Check every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

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
            link.download = `sidata_backup_${date}.json`;
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

    const handleLoadAutoBackup = () => {
        try {
            const backupJson = localStorage.getItem('sipdata_autobackup');
            if (!backupJson) {
                toast({
                    variant: 'destructive',
                    title: 'Backup Otomatis Tidak Ditemukan',
                    description: 'Belum ada backup otomatis yang dibuat.',
                });
                return;
            }
    
            const backup = JSON.parse(backupJson);
    
            const keys = ['entrepreneurs', 'institutions', 'user', 'user_profiles', 'comparisonData'];
            
            keys.forEach(key => {
                if (backup[key]) {
                    localStorage.setItem(key, backup[key]);
                } else {
                    localStorage.removeItem(key);
                }
            });
    
            toast({
                title: 'Pemulihan Berhasil!',
                description: `Data telah dipulihkan dari backup ${format(new Date(backup.timestamp), 'dd MMM yyyy, HH:mm')}. Aplikasi akan dimuat ulang.`,
            });
    
            setTimeout(() => {
                window.location.reload();
            }, 2000);
    
        } catch (error) {
            console.error("Failed to load auto-backup", error);
            toast({
                variant: 'destructive',
                title: 'Gagal Memulihkan Data',
                description: 'File backup otomatis rusak atau tidak dapat dibaca.',
            });
        }
    };

    const handleTerminalCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const command = e.currentTarget.value.trim();
        if (command === 'HapusData') {
            try {
                localStorage.removeItem('comparisonData');
                // setComparisonData([]);
                // setSearchResult(null);
                // setSearchTerm('');
                toast({
                    title: 'Berhasil!',
                    description: 'Data pembanding telah dihapus dari perangkat.',
                });
            } catch (error) {
                console.error("Failed to remove comparison data", error);
                toast({
                    variant: 'destructive',
                    title: 'Gagal Menghapus Data',
                    description: 'Terjadi kesalahan saat menghapus data pembanding.',
                });
            }
        } else if (command === 'ResetData') {
             if (!user) {
                 toast({
                    variant: 'destructive',
                    title: 'Aksi Gagal',
                    description: 'Anda harus login untuk melakukan aksi ini.',
                });
            } else {
                try {
                    // updateUserProfile({}); // Reset profile
                    // This is handled in AuthContext now
                    const allProfiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
                    delete allProfiles[user.username];
                    localStorage.setItem('user_profiles', JSON.stringify(allProfiles));
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    if(currentUser.username === user.username) {
                        currentUser.data = {};
                        localStorage.setItem('user', JSON.stringify(currentUser));
                    }

                    toast({
                        title: 'Berhasil!',
                        description: 'Pengaturan profil pengguna telah direset. Silakan muat ulang.',
                    });
                     setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } catch (error) {
                    console.error("Failed to reset user profile", error);
                    toast({
                        variant: 'destructive',
                        title: 'Gagal Mereset Profil',
                        description: 'Terjadi kesalahan saat mereset profil pengguna.',
                    });
                }
            }
        }
        else {
            toast({
                variant: 'destructive',
                title: 'Perintah Tidak Dikenal',
                description: `Perintah "${command}" tidak valid. Gunakan 'HapusData' atau 'ResetData'.`,
            });
        }
        e.currentTarget.value = '';
    }
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
                        <strong className="text-primary">Penyimpanan Otomatis:</strong> Semua perubahan yang Anda buat (input data UMKM, lembaga, dan pembaruan profil) secara otomatis disimpan langsung ke penyimpanan internal browser Anda. Selain itu, sistem membuat cadangan otomatis setiap 10 menit.
                    </p>
                    <p>
                       <strong className="text-primary">Kapan Harus Backup Manual?</strong> Fitur "Export Data" di bawah ini berguna untuk membuat salinan file cadangan (.json) yang bisa Anda simpan di tempat lain (misal: Google Drive, Flashdisk). Lakukan ini secara berkala sebagai lapisan keamanan ekstra, terutama sebelum membersihkan data browser atau berpindah perangkat.
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-primary/20 border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><FileClock /> Pemulihan Otomatis</CardTitle>
                    <CardDescription>
                        Aplikasi menyimpan cadangan otomatis setiap 10 menit. Gunakan tombol ini untuk memulihkan data dari cadangan otomatis terakhir jika terjadi kesalahan.
                    </CardDescription>
                    {lastBackupTime ? (
                        <p className="text-xs text-muted-foreground pt-2">
                            Cadangan terakhir dibuat pada: {format(new Date(lastBackupTime), 'dd MMMM yyyy, HH:mm:ss')}
                        </p>
                    ) : (
                        <p className="text-xs text-muted-foreground pt-2">
                           Belum ada cadangan otomatis yang dibuat.
                        </p>
                    )}
                </CardHeader>
                {!isDataChecker && (
                <CardContent>
                    <Button onClick={handleLoadAutoBackup} disabled={!lastBackupTime}>
                        <RotateCcw className="mr-2" /> Pulihkan dari Backup Otomatis
                    </Button>
                </CardContent>
                )}
            </Card>

            {!isDataChecker && (
            <Card className="shadow-lg border-none bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileDown /> Export Data Manual</CardTitle>
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
            )}

            <Card className="shadow-lg border-destructive/20 border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><FileUp /> Import Data Manual</CardTitle>
                    <CardDescription>
                       Pulihkan data dari file backup JSON manual. <strong className="text-destructive">PERHATIAN:</strong> Tindakan ini akan menimpa semua data yang ada saat ini dengan data dari file backup.
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
            
            {!isDataChecker && (
            <Card className="shadow-lg border-destructive/20 border">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive"><Terminal /> Terminal Aksi Berbahaya</CardTitle>
                  <CardDescription>
                      Gunakan terminal ini untuk melakukan aksi yang tidak bisa dibatalkan. Ketik <code className="bg-muted text-destructive font-mono p-1 rounded-sm">HapusData</code> untuk menghapus data pembanding, atau <code className="bg-muted text-destructive font-mono p-1 rounded-sm">ResetData</code> untuk mereset profil pengguna Anda.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="bg-slate-900 text-green-400 font-mono p-2 rounded-md flex items-center gap-2">
                      <span className="pl-2 text-green-400/70">$</span>
                      <Input 
                          placeholder="Ketik perintah di sini..."
                          className="bg-transparent border-none text-green-400 placeholder:text-green-400/50 focus-visible:ring-0 focus-visible:ring-offset-0 !p-2"
                          onKeyDown={handleTerminalCommand}
                      />
                  </div>
              </CardContent>
          </Card>
          )}
        </div>
    );
}
