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
import { Search, Download, Printer, MoreHorizontal, Pencil, Trash2, FileText } from 'lucide-react';
import type { Institution } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useInstitution } from '@/context/InstitutionContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


type InstitutionDataTableProps = {
  data: Institution[];
};

export function InstitutionDataTable({ data }: InstitutionDataTableProps) {
  const { deleteInstitution } = useInstitution();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return item.institutionName.toLowerCase().includes(searchLower) ||
             item.proposerName.toLowerCase().includes(searchLower) ||
             item.institutionAddress.toLowerCase().includes(searchLower);
    });
  }, [data, searchTerm]);

  const exportToCsv = () => {
    const headers = [
      'Nama Lembaga',
      'Alamat Lembaga',
      'Nama Pengusul',
      'No. Ponsel Pengusul',
      'Jumlah Pengurus',
      'Tanggal Registrasi',
    ];

    const rows = filteredData.map((item) =>
      [
        `"${item.institutionName.replace(/"/g, '""')}"`,
        `"${item.institutionAddress.replace(/"/g, '""')}"`,
        item.proposerName,
        `'${item.proposerPhoneNumber}`,
        item.boardMembers.length,
        format(new Date(item.registrationDate), 'yyyy-MM-dd'),
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'database_lembaga_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handlePrintSingle = (item: Institution) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Data Lembaga: ${item.institutionName}`, 14, 22);
      doc.setFontSize(11);
      
      const generalData = [
          { title: 'Nama Lembaga', data: item.institutionName },
          { title: 'Alamat Lembaga', data: item.institutionAddress },
          { title: 'Nama Pengusul', data: item.proposerName },
          { title: 'No. Ponsel Pengusul', data: item.proposerPhoneNumber },
          { title: 'Tanggal Registrasi', data: format(new Date(item.registrationDate), 'dd MMMM yyyy') },
      ];

      (doc as any).autoTable({
          startY: 30,
          theme: 'grid',
          head: [['Informasi Umum', '']],
          body: generalData.map(d => [d.title, d.data]),
      });

      const legalities = Object.entries(item.legalities)
        .filter(([key, value]) => key.endsWith('File') && value)
        .map(([key, value]) => ({ 
            name: key.replace('File', '').replace(/([A-Z])/g, ' $1').replace('npwp', 'NPWP').trim(), 
            // @ts-ignore
            fileName: value?.name || 'File terlampir'
        }));
      
      if(legalities.length > 0) {
        (doc as any).autoTable({
            theme: 'striped',
            head: [['Legalitas', 'Nama File']],
            body: legalities.map(l => [l.name, l.fileName]),
        });
      }


      if(item.boardMembers.length > 0) {
        (doc as any).autoTable({
            theme: 'striped',
            head: [['Nama Pengurus', 'NIK', 'Jabatan', 'No. Ponsel']],
            body: item.boardMembers.map(m => [m.name, m.nik, m.position, m.phoneNumber]),
        });
      }
      
      doc.save(`data_lembaga_${item.institutionName.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <Card className="shadow-lg border-none bg-card/80">
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama lembaga, pengusul, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-background"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCsv} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nama Lembaga</TableHead>
                <TableHead>Nama Pengusul</TableHead>
                <TableHead>Jumlah Pengurus</TableHead>
                <TableHead>Jumlah Legalitas</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const legalitiesCount = Object.values(item.legalities).filter(val => typeof val === 'object' && val !== null).length;
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium">{item.institutionName}</TableCell>
                        <TableCell>{item.proposerName}</TableCell>
                        <TableCell>{item.boardMembers.length}</TableCell>
                        <TableCell>{legalitiesCount}</TableCell>
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
                                    <Link href={`/input-lembaga?id=${item.id}`} className="cursor-pointer">
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
                                                Tindakan ini tidak bisa dibatalkan. Ini akan menghapus data untuk <span className="font-bold">{item.institutionName}</span> secara permanen.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteInstitution(item.id)} className="bg-destructive hover:bg-destructive/90">
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-48">
                     <p className="text-lg text-muted-foreground">Tidak ada data lembaga yang tersedia.</p>
                     <p className="text-sm text-muted-foreground">Mulai dengan menambahkan data lembaga baru.</p>
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
