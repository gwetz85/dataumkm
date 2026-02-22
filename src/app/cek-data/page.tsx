'use client';

import * as React from 'react';
import * as xlsx from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Search, UserCheck, UserX, FileWarning, Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


export default function CekDataPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [comparisonData, setComparisonData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchType, setSearchType] = React.useState('nik');
  const [searchResult, setSearchResult] = React.useState<any[] | any | null | 'not_found'>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [terminalInput, setTerminalInput] = React.useState('');


  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('comparisonData');
      if (savedData) {
        const dateReviver = (key: string, value: any) => {
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                return new Date(value);
            }
            return value;
        };
        setComparisonData(JSON.parse(savedData, dateReviver));
      }
    } catch (error) {
      console.error("Failed to parse comparison data from localStorage", error);
      toast({
        variant: 'destructive',
        title: 'Gagal memuat data pembanding',
        description: 'Data yang tersimpan sepertinya rusak.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = xlsx.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const mappedData: any[] = xlsx.utils.sheet_to_json(worksheet);
        
        if (mappedData.length < 1) {
             toast({
                variant: 'destructive',
                title: 'File Excel Kosong atau Tidak Valid',
                description: 'Pastikan file memiliki header dan setidaknya satu baris data.',
            });
            return;
        }

        localStorage.setItem('comparisonData', JSON.stringify(mappedData));
        setComparisonData(mappedData);
        toast({
          title: 'Upload Berhasil!',
          description: `Berhasil memuat ${mappedData.length} data pembanding.`,
        });
      } catch (error) {
        console.error("Failed to process Excel file", error);
        toast({
          variant: 'destructive',
          title: 'Gagal Memproses File',
          description: 'Pastikan format file Excel (.xlsx, .xls, .csv) sudah benar.',
        });
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };
  
  const handleSearch = () => {
    if (!searchTerm) {
        toast({
            variant: "destructive",
            title: "Nomor Pengecekan Diperlukan",
            description: `Silakan masukkan ${searchType === 'nik' ? 'NIK' : 'Nomor KK'} untuk pengecekan.`,
        });
        return;
    }

    if (comparisonData.length === 0 && !loading) {
        toast({
            variant: "destructive",
            title: "Data Pembanding Kosong",
            description: "Silakan upload file data pembanding terlebih dahulu.",
        });
        return;
    }
    
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
        if (comparisonData.length > 0) {
            const dataKeys = Object.keys(comparisonData[0]);
            let searchKey;

            if (searchType === 'kk') {
                if (dataKeys.length < 1) {
                    toast({
                        variant: "destructive",
                        title: "Format Data Tidak Sesuai",
                        description: "Data pembanding tidak memiliki setidaknya satu kolom untuk pengecekan No. KK.",
                    });
                    setSearchResult('not_found');
                    setIsSearching(false);
                    return;
                }
                searchKey = dataKeys[0]; // First column (index 0) for KK
                
                const results = comparisonData.filter(item => 
                    item[searchKey]?.toString().trim() === searchTerm.trim()
                );
                setSearchResult(results.length > 0 ? results : 'not_found');

            } else { // searchType is 'nik'
                if (dataKeys.length < 2) {
                    toast({
                        variant: "destructive",
                        title: "Format Data Tidak Sesuai",
                        description: "Data pembanding tidak memiliki kolom kedua untuk pengecekan NIK.",
                    });
                    setSearchResult('not_found');
                    setIsSearching(false);
                    return;
                }
                searchKey = dataKeys[1]; // Second column (index 1) for NIK

                const result = comparisonData.find(item => 
                    item[searchKey]?.toString().trim() === searchTerm.trim()
                );
                setSearchResult(result || 'not_found');
            }
        } else {
             setSearchResult('not_found');
        }
        setIsSearching(false);
    }, 500);

  };

  const handleTerminalCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (terminalInput.trim() === 'HapusData') {
            try {
                localStorage.removeItem('comparisonData');
                setComparisonData([]);
                setSearchResult(null);
                setSearchTerm('');
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
        } else {
            toast({
                variant: 'destructive',
                title: 'Perintah Tidak Dikenal',
                description: `Perintah "${terminalInput}" tidak valid. Gunakan 'HapusData'.`,
            });
        }
        setTerminalInput('');
    }
  };


  const renderSearchResult = () => {
    if (isSearching) {
        return <Skeleton className="h-48 w-full" />;
    }

    const formatValue = (value: any) => {
        if (value instanceof Date && !isNaN(value.getTime())) {
            return format(value, 'dd/MM/yyyy');
        }
        return String(value ?? '-');
    };

    if (searchResult === 'not_found') {
      return (
        <Alert variant="destructive">
            <UserX className="h-4 w-4" />
            <AlertTitle>Data Tidak Ditemukan</AlertTitle>
            <AlertDescription>
                Data dengan {searchType === 'nik' ? 'NIK' : 'No. KK'} <strong>{searchTerm}</strong> tidak ditemukan dalam data pembanding.
            </AlertDescription>
        </Alert>
      );
    }

    if (searchResult && typeof searchResult === 'object') {
      const results = Array.isArray(searchResult) ? searchResult : [searchResult];
      const resultCount = results.length;
      const title = resultCount > 1 
          ? `${resultCount} Data Ditemukan!`
          : 'Data Ditemukan!';
      return (
        <Alert>
            <UserCheck className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                <div className="space-y-4">
                    {results.map((item, index) => (
                         <div key={index} className="mt-2 space-y-2 text-sm border-t pt-4 first:mt-0 first:border-t-0 first:pt-0">
                            {Object.entries(item).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-3 gap-2">
                                <span className="font-semibold capitalize col-span-1">{key.replace(/_/g, ' ')}</span>
                                <span className="col-span-2">{formatValue(value)}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">
        {isAuthenticated ? 'Cek Data & Upload Data Pembanding' : 'Cek Data'}
      </h1>
      
      {isAuthenticated && (
        <Card className="shadow-lg border-none bg-card/80">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload /> Upload Data Pembanding</CardTitle>
            <CardDescription>
                Upload file Excel (.xlsx, .xls) sebagai data pembanding. Data ini akan disimpan di perangkat Anda. 
                <strong className="block mt-1 text-primary">PENTING: Aplikasi akan menggunakan kolom pertama (A) untuk No. KK dan kolom kedua (B) untuk NIK, apapun nama headernya.</strong>
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Input 
                type="file" 
                onChange={handleFileUpload} 
                accept=".xlsx, .xls, .csv"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
            </CardContent>
        </Card>
      )}

      <Card className="shadow-lg border-none bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search /> Cek Data Pelaku Usaha</CardTitle>
          <CardDescription>Pilih jenis pengecekan (NIK atau No. KK), lalu masukkan nomor untuk memeriksa apakah data pelaku usaha sudah ada di dalam data pembanding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <RadioGroup value={searchType} onValueChange={(value) => setSearchType(value)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nik" id="r-nik" />
                  <Label htmlFor="r-nik">Berdasarkan NIK</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kk" id="r-kk" />
                  <Label htmlFor="r-kk">Berdasarkan No. KK</Label>
              </div>
            </RadioGroup>
            <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                    placeholder={`Masukkan ${searchType === 'nik' ? 'NIK' : 'Nomor KK'} untuk pengecekan...`} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={comparisonData.length === 0}
                />
                <Button onClick={handleSearch} disabled={isSearching || comparisonData.length === 0} className="w-full sm:w-auto">
                    {isSearching ? 'Mencari...' : <><Search className="mr-2"/> Cek Data</>}
                </Button>
            </div>
            {comparisonData.length === 0 && !loading && !isAuthenticated && (
                 <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                    <FileWarning className="h-4 w-4 !text-amber-800" />
                    <AlertTitle>Data Pembanding Belum Tersedia</AlertTitle>
                    <AlertDescription>
                       Data pembanding hanya bisa diunggah oleh pengguna yang sudah login.
                    </AlertDescription>
                </Alert>
            )}
            {comparisonData.length === 0 && !loading && isAuthenticated && (
                 <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                    <FileWarning className="h-4 w-4 !text-amber-800" />
                    <AlertTitle>Data Pembanding Belum Tersedia</AlertTitle>
                    <AlertDescription>
                       Anda perlu mengunggah file data pembanding terlebih dahulu sebelum dapat melakukan pengecekan.
                    </AlertDescription>
                </Alert>
            )}
        </CardContent>
      </Card>

      {searchResult && (
         <Card className="shadow-lg border-none bg-card/80">
            <CardHeader>
                <CardTitle>Hasil Pengecekan</CardTitle>
            </CardHeader>
            <CardContent>
                {renderSearchResult()}
            </CardContent>
         </Card>
      )}

      {isAuthenticated && (
          <Card className="shadow-lg border-destructive/20 border">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive"><Terminal /> Terminal Aksi Berbahaya</CardTitle>
                  <CardDescription>
                      Gunakan terminal ini untuk melakukan aksi yang tidak bisa dibatalkan. Ketik <code className="bg-muted text-destructive font-mono p-1 rounded-sm">HapusData</code> dan tekan Enter untuk menghapus semua data pembanding dari perangkat Anda.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="bg-slate-900 text-green-400 font-mono p-2 rounded-md flex items-center gap-2">
                      <span className="pl-2 text-green-400/70">$</span>
                      <Input 
                          placeholder="Ketik perintah di sini..."
                          className="bg-transparent border-none text-green-400 placeholder:text-green-400/50 focus-visible:ring-0 focus-visible:ring-offset-0 !p-2"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyDown={handleTerminalCommand}
                      />
                  </div>
              </CardContent>
          </Card>
      )}

    </div>
  );
}
