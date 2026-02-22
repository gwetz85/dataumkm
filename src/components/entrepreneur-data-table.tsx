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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download } from 'lucide-react';
import type { Entrepreneur } from '@/lib/types';
import { format } from 'date-fns';

type EntrepreneurDataTableProps = {
  data: Entrepreneur[];
};

export function EntrepreneurDataTable({ data }: EntrepreneurDataTableProps) {
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
        item.nik.includes(searchLower) ||
        item.businessLocation.toLowerCase().includes(searchLower);

      const matchesBusinessType = filterBusinessType === 'all' || item.businessType === filterBusinessType;
      const matchesCoordinator = filterCoordinator === 'all' || item.coordinator === filterCoordinator;

      return matchesSearch && matchesBusinessType && matchesCoordinator;
    });
  }, [data, searchTerm, filterBusinessType, filterCoordinator]);

  const exportToCsv = () => {
    const headers = [
      'NIK',
      'No. KK',
      'Nama Lengkap',
      'No. Ponsel',
      'Alamat',
      'Jenis Usaha',
      'Lokasi Usaha',
      'Koordinator',
      'Tanggal Registrasi',
    ];

    const rows = filteredData.map((item) =>
      [
        item.nik,
        item.kk,
        item.fullName,
        item.phoneNumber,
        `"${item.address.replace(/"/g, '""')}"`, // Handle quotes in address
        item.businessType,
        item.businessLocation,
        item.coordinator,
        format(new Date(item.registrationDate), 'yyyy-MM-dd'),
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'wiradata_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Entrepreneur Database</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, NIK, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Select value={filterBusinessType} onValueChange={setFilterBusinessType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Business Type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Business Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCoordinator} onValueChange={setFilterCoordinator}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Coordinator" />
              </SelectTrigger>
              <SelectContent>
                {coordinators.map((coord) => (
                  <SelectItem key={coord} value={coord}>
                    {coord === 'all' ? 'All Coordinators' : coord}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportToCsv} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.fullName}</TableCell>
                    <TableCell>{item.businessType}</TableCell>
                    <TableCell>{item.businessLocation}</TableCell>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell>{item.coordinator}</TableCell>
                    <TableCell>{format(new Date(item.registrationDate), 'dd MMM yyyy')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No data found.
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
