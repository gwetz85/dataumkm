'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Institution } from '@/lib/types';
import { format } from 'date-fns';
import { FileText, Building, User, Phone, Home, Link, Users, Edit } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

type InstitutionPreviewDialogProps = {
  institution: Institution | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function InstitutionPreviewDialog({ institution, isOpen, onOpenChange }: InstitutionPreviewDialogProps) {
  if (!institution) return null;

  const allFiles = [
    ...(institution.activityPhoto ? [{name: 'Foto Kegiatan / Plang', file: institution.activityPhoto}] : []),
    ...(institution.legalities.skLembagaFile ? [{name: 'SK Lembaga', file: institution.legalities.skLembagaFile}] : []),
    ...(institution.legalities.skKemenkumhamFile ? [{name: 'Akte Kemenkumham / SK Kemenag', file: institution.legalities.skKemenkumhamFile}] : []),
    ...(institution.legalities.npwpLembagaFile ? [{name: 'NPWP Lembaga', file: institution.legalities.npwpLembagaFile}] : []),
    ...(institution.legalities.suratDomisiliFile ? [{name: 'Surat Domisili', file: institution.legalities.suratDomisiliFile}] : []),
  ]
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Building className="h-6 w-6 text-primary" />
            Detail Lembaga: {institution.institutionName}
          </DialogTitle>
          <DialogDescription>
            Kode Verifikasi: <span className="font-mono">{institution.barcode}</span> &bull; Terdaftar pada {format(new Date(institution.registrationDate), 'dd MMMM yyyy')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="space-y-6">
            {/* Data Pengajuan & Lembaga */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary flex items-center gap-2"><User />Data Pengajuan & Lembaga</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                      <User className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                      <div>
                          <p className="font-medium">Nama Koordinator</p>
                          <p className="text-muted-foreground">{institution.proposerName}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                      <div>
                          <p className="font-medium">Kontak Koordinator</p>
                          <p className="text-muted-foreground">{institution.proposerPhoneNumber}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <Building className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                      <div>
                          <p className="font-medium">Nama Lembaga</p>
                          <p className="text-muted-foreground">{institution.institutionName}</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-3">
                      <Home className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                      <div>
                          <p className="font-medium">Alamat Lembaga</p>
                          <p className="text-muted-foreground">{institution.institutionAddress}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3 sm:col-span-2">
                      <Edit className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                      <div>
                          <p className="font-medium">Usulan yang diajukan</p>
                          <p className="text-muted-foreground">{institution.proposalDescription}</p>
                      </div>
                  </div>
              </div>
            </div>

            {/* Berkas */}
            {allFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2"><FileText /> Upload Berkas</h4>
                <div className="p-4 border rounded-lg space-y-2">
                  {allFiles.map(({ name, file }) => (
                    <div key={name} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <p className="font-medium text-sm">{name}</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={file.dataUrl} target="_blank" rel="noopener noreferrer" download={file.name}>
                          <Link className="mr-2" />
                          Lihat File
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Penanggung Jawab */}
            {institution.boardMembers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary flex items-center gap-2"><Users /> Penanggung Jawab</h4>
                  <div className="space-y-4">
                    {institution.boardMembers.map((member, index) => (
                      <div key={index} className="p-4 border rounded-md">
                          <p className="font-semibold mb-2">{member.name} - <span className="font-normal text-muted-foreground">{member.tenure}</span></p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <div>
                                <p className="font-medium text-foreground">Kontak</p>
                                <p>{member.phoneNumber}</p>
                            </div>
                             <div>
                                <p className="font-medium text-foreground">NIK</p>
                                <p>{member.nik}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="font-medium text-foreground">Alamat</p>
                                <p>{member.address}</p>
                            </div>
                          </div>
                      </div>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="pt-4 mt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
