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
import { Search, Printer, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { NIB } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useNIB } from '@/context/NIBContext';
import { useAuth } from '@/context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


type NIBDataTableProps = {
  data: NIB[];
};

export function NIBDataTable({ data }: NIBDataTableProps) {
  const { deleteNIB } = useNIB();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return item.fullName.toLowerCase().includes(searchLower) ||
             item.nik.includes(searchLower) ||
             item.businessName.toLowerCase().includes(searchLower) ||
             item.businessType.toLowerCase().includes(searchLower) ||
             item.barcode.includes(searchLower);
    });
  }, [data, searchTerm]);

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

  const handlePrintSingle = (item: NIB) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Data Pembuatan NIB: ${item.fullName}`, 14, 22);
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
              { title: 'NIK', data: item.nik },
              { title: 'Tempat, Tanggal Lahir', data: `${item.birthPlace}, ${birthDateFormatted}` },
              { title: 'Alamat Lengkap', data: `${item.address}, RT ${item.rt}/RW ${item.rw}` },
              { title: 'Usaha', data: item.businessType },
              { title: 'Nama Usaha', data: item.businessName },
              { title: 'Lokasi Usaha', data: item.businessLocation },
              { title: 'Modal Usaha', data: `Rp ${parseInt(item.businessCapital).toLocaleString('id-ID')}` },
              { title: 'Lama Usaha', data: item.businessDuration },
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
      doc.save(`data_nib_${item.fullName.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <Card className="shadow-lg border-none bg-card/80">
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama, NIK, nama usaha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-background"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Nama Usaha</TableHead>
                <TableHead>Jenis Usaha</TableHead>
                <TableHead>Modal Usaha</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">{item.fullName}</TableCell>
                    <TableCell>{item.businessName}</TableCell>
                    <TableCell>{item.businessType}</TableCell>
                    <TableCell>Rp {parseInt(item.businessCapital).toLocaleString('id-ID')}</TableCell>
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
                                <Link href={`/input-nib?id=${item.id}`} className="cursor-pointer">
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
                                              Tindakan ini tidak bisa dibatalkan. Ini akan menghapus data NIB untuk <span className="font-bold">{item.fullName}</span> secara permanen.
                                          </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                          <AlertDialogCancel>Batal</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deleteNIB(item.id)} className="bg-destructive hover:bg-destructive/90">
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
                  <TableCell colSpan={6} className="text-center h-48">
                     <p className="text-lg text-muted-foreground">Tidak ada data yang tersedia.</p>
                     <p className="text-sm text-muted-foreground">Mulai dengan menambahkan data pembuatan NIB baru.</p>
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
