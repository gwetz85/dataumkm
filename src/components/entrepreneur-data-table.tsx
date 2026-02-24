'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Download, Printer, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Entrepreneur } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEntrepreneur } from '@/context/EntrepreneurContext';
import { useAuth } from '@/context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


type EntrepreneurDataTableProps = {
  data: Entrepreneur[];
};

export function EntrepreneurDataTable({ data }: EntrepreneurDataTableProps) {
  const { deleteEntrepreneur } = useEntrepreneur();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterBusinessType, setFilterBusinessType] = React.useState('all');
  const [filterCoordinator, setFilterCoordinator] = React.useState('all');

  const businessTypes = React.useMemo(() => ['all', ...Array.from(new Set(data.map((item) => item.businessType)))], [data]);
  const coordinators = React.useMemo(() => ['all', ...Array.from(new Set(data.map((item) => item.coordinator)))], [data]);

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.fullName.toLowerCase().includes(searchLower) ||
        item.address.toLowerCase().includes(searchLower) ||
        item.kelurahan.toLowerCase().includes(searchLower) ||
        item.kecamatan.toLowerCase().includes(searchLower) ||
        item.businessType.toLowerCase().includes(searchLower) ||
        item.businessLocation.toLowerCase().includes(searchLower) ||
        item.barcode.includes(searchLower);

      const matchesBusinessType = filterBusinessType === 'all' || item.businessType === filterBusinessType;
      const matchesCoordinator = filterCoordinator === 'all' || item.coordinator === filterCoordinator;

      return matchesSearch && matchesBusinessType && matchesCoordinator;
    });
  }, [data, searchTerm, filterBusinessType, filterCoordinator]);

  const addVerifierFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);
        const verifierText = `Data diverifikasi oleh: ${user?.data?.fullName || user?.username || 'N/A'}`;
        const verifierNik = `NIK Verifikator: ${user?.data?.nik || 'N/A'}`;
        const printDate = `Tanggal Cetak: ${format(new Date(), 'dd MMMM yyyy, HH:mm')}`;

        doc.text(verifierText, 14, doc.internal.pageSize.height - 15);
        doc.text(verifierNik, 14, doc.internal.pageSize.height - 10);
        doc.text(printDate, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
    }
  };

  const handlePrintAll = () => {
    const doc = new jsPDF();
    doc.text("Data Pelaku Usaha UMKM", 14, 16);
    (doc as any).autoTable({
        head: [['Nama', 'Alamat', 'Jenis Usaha', 'Koordinator', 'Bank']],
        body: filteredData.map(item => [
            item.fullName,
            `${item.kelurahan}, ${item.kecamatan}`,
            item.businessType,
            item.coordinator,
            item.bankName,
        ]),
        startY: 20,
    });
    addVerifierFooter(doc);
    doc.save('database_umkm.pdf');
  };

  const handlePrintSingle = (item: Entrepreneur) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Data Pelaku Usaha: ${item.fullName}`, 14, 22);
      doc.setFontSize(11);
      
      let birthDateFormatted = 'N/A';
      try {
        if(item.birthDate) {
          birthDateFormatted = format(new Date(item.birthDate), 'dd MMMM yyyy');
        }
      } catch (e) {
        // Keep N/A if date is invalid
      }
      
      (doc as any).autoTable({
          startY: 30,
          theme: 'grid',
          body: [
              { title: 'Kode Verifikasi', data: item.barcode },
              { title: 'Nama Lengkap', data: item.fullName },
              { title: 'Jenis Kelamin', data: item.gender },
              { title: 'Tempat, Tanggal Lahir', data: `${item.birthPlace}, ${birthDateFormatted}` },
              { title: 'Alamat Lengkap', data: `${item.address}, RT ${item.rt}/RW ${item.rw}` },
              { title: 'Kelurahan', data: item.kelurahan },
              { title: 'Kecamatan', data: item.kecamatan },
              { title: 'Jenis Usaha', data: item.businessType },
              { title: 'Lokasi Usaha', data: item.businessLocation },
              { title: 'Nama Bank', data: item.bankName },
              { title: 'Nomor Rekening', data: item.accountNumber },
              { title: 'Koordinator', data: item.coordinator },
              { title: 'Tanggal Registrasi', data: format(new Date(item.registrationDate), 'dd MMMM yyyy') },
          ],
          columnStyles: {
            title: { fontStyle: 'bold', cellWidth: 55 },
            data: { cellWidth: 'auto' }
          },
          columns: [
              { header: 'Field', dataKey: 'title' },
              { header: 'Value', dataKey: 'data' },
          ],
      });
      addVerifierFooter(doc);
      doc.save(`data_${item.fullName.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <Card className="shadow-lg border-none bg-card/80">
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama, alamat, jenis usaha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-background"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full md:w-auto">
             <Select value={filterBusinessType} onValueChange={setFilterBusinessType}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filter Jenis Usaha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis Usaha</SelectItem>
                {businessTypes.filter(t => t !== 'all').map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCoordinator} onValueChange={setFilterCoordinator}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filter Koordinator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Koordinator</SelectItem>
                {coordinators.filter(c => c !== 'all').map((coord) => (
                  <SelectItem key={coord} value={coord}>{coord}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handlePrintAll} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Jenis Usaha</TableHead>
                <TableHead>Lokasi Usaha</TableHead>
                <TableHead>Koordinator</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">{item.fullName}</TableCell>
                    <TableCell>{item.kelurahan}, {item.kecamatan}</TableCell>
                    <TableCell>{item.businessType}</TableCell>
                    <TableCell>{item.businessLocation}</TableCell>
                    <TableCell>{item.coordinator}</TableCell>
                    <TableCell>{format(new Date(item.registrationDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Buka menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/input-data?id=${item.id}`} className="cursor-pointer">
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintSingle(item)} className="cursor-pointer">
                                  <Printer className="mr-2 h-4 w-4" />
                                  <span>Cetak Detail</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          <span>Hapus</span>
                                      </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                              Tindakan ini tidak bisa dibatalkan. Ini akan menghapus data untuk <span className="font-bold">{item.fullName}</span> secara permanen.
                                          </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                          <AlertDialogCancel>Batal</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deleteEntrepreneur(item.id)} className="bg-destructive hover:bg-destructive/90">
                                              Hapus
                                          </AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-48">
                     <p className="text-lg text-muted-foreground">Tidak ada data yang tersedia.</p>
                     <p className="text-sm text-muted-foreground">Mulai dengan menambahkan data pelaku usaha baru.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
