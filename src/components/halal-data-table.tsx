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
import type { HalalCertification } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useHalal } from '@/context/HalalContext';
import { useAuth } from '@/context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


type HalalDataTableProps = {
  data: HalalCertification[];
};

export function HalalDataTable({ data }: HalalDataTableProps) {
  const { deleteHalalCertification } = useHalal();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return item.businessOwner.name.toLowerCase().includes(searchLower) ||
             item.businessOwner.nik.includes(searchLower) ||
             item.businessActivity.businessName.toLowerCase().includes(searchLower) ||
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

  const handlePrintSingle = (item: HalalCertification) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Pengajuan Sertifikat Halal: ${item.businessOwner.name}`, 14, 22);
      doc.setFontSize(10);
      doc.text(`Kode Verifikasi: ${item.barcode}`, 14, 28);
      
      const printSection = (title: string, data: any[][]) => {
        (doc as any).autoTable({
          head: [[{ content: title, colSpan: 2, styles: { fontStyle: 'bold', fillColor: [230, 230, 230], textColor: 20 } }]],
          body: data,
          theme: 'grid',
          columnStyles: { 0: { fontStyle: 'bold', cellWidth: 55 }, 1: { cellWidth: 'auto' } }
        });
      };

      const owner = item.businessOwner;
      printSection('Data Pelaku Usaha', [
        ['Nama', owner.name], ['NIK', owner.nik], ['Jenis Kelamin', owner.gender], ['No. Ponsel', owner.phoneNumber], ['Email', owner.email], ['Alamat', `${owner.address}, RT ${owner.rt}/RW ${owner.rw}`], ['Kelurahan', owner.kelurahan], ['Kode Pos', owner.postalCode]
      ]);

      const pic = item.personInCharge;
      printSection('Data Penanggung Jawab', [
        ['Nama', pic.name], ['NIK', pic.nik], ['Jenis Kelamin', pic.gender], ['No. Ponsel', pic.phoneNumber], ['Email', pic.email], ['Alamat', `${pic.address}, RT ${pic.rt}/RW ${pic.rw}`], ['Kelurahan', pic.kelurahan], ['Kode Pos', pic.postalCode]
      ]);

      const factory = item.factory;
      printSection('Data Pabrik', [
        ['Alamat', `${factory.address}, RT ${factory.rt}/RW ${factory.rw}`], ['Kelurahan', factory.kelurahan], ['Kode Pos', factory.postalCode]
      ]);

      const activity = item.businessActivity;
      printSection('Data Kegiatan Usaha', [
          ['Nama Usaha', activity.businessName], ['Jenis Usaha', activity.businessType], ['Modal Usaha', `Rp ${parseInt(activity.businessCapital).toLocaleString('id-ID')}`], ['Penghasilan', `Rp ${parseInt(activity.income).toLocaleString('id-ID')}`], ['Lama Usaha', activity.businessDuration], ['Pemasaran Produk', activity.productMarketing]
      ]);
      
      const nib = item.nibCheck;
      printSection('Pemeriksaan NIB', [['Nomor NIB', nib.nibNumber], ['KBLI', nib.kbli], ['Hasil Produk', nib.productResult]]);
      
      const sihalal = item.siHalalAccount;
      printSection('Akun SiHalal', [['Email', sihalal.email], ['Kata Sandi', '********'], ['Status Akun', sihalal.accountStatus]]);

      const addLongText = (title: string, text: string) => {
          doc.addPage();
          doc.setFontSize(14);
          doc.text(title, 14, 22);
          doc.setFontSize(10);
          const splitText = doc.splitTextToSize(text, 180);
          doc.text(splitText, 14, 30);
      }

      addLongText('Bahan Yang Digunakan', item.ingredients);
      addLongText('Pembersihan Peralatan', item.equipmentCleaning);
      addLongText('Kemasan', item.packaging);
      addLongText('Tata Cara Pengolahan', item.processingMethod);

      addVerifierFooter(doc);
      doc.save(`sertifikat_halal_${item.businessOwner.name.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <Card className="shadow-lg border-none bg-card/80">
      <CardHeader className="border-b">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama pelaku usaha, NIK, nama usaha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-background"
            />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nama Pelaku Usaha</TableHead>
                <TableHead>Nama Usaha</TableHead>
                <TableHead>No. Ponsel</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">{item.businessOwner.name}</TableCell>
                    <TableCell>{item.businessActivity.businessName}</TableCell>
                    <TableCell>{item.businessOwner.phoneNumber}</TableCell>
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
                                <Link href={`/input-sertifikat-halal?id=${item.id}`} className="cursor-pointer">
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintSingle(item)} className="cursor-pointer">
                                  <Printer className="mr-2 h-4 w-4" />
                                  <span>Cetak</span>
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
                                              Tindakan ini akan menghapus data pengajuan untuk <span className="font-bold">{item.businessOwner.name}</span> secara permanen.
                                          </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                          <AlertDialogCancel>Batal</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deleteHalalCertification(item.id)} className="bg-destructive hover:bg-destructive/90">
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
                  <TableCell colSpan={5} className="text-center h-48">
                     <p className="text-lg text-muted-foreground">Tidak ada data yang tersedia.</p>
                     <p className="text-sm text-muted-foreground">Mulai dengan menambahkan data pengajuan baru.</p>
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
