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
import { FileText, Building, User, Phone, Home, Link, Users, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

type InstitutionPreviewDialogProps = {
  institution: Institution | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function InstitutionPreviewDialog({ institution, isOpen, onOpenChange }: InstitutionPreviewDialogProps) {
  if (!institution) return null;

  const legalities = Object.entries(institution.legalities)
    .filter(([key, value]) => key.endsWith('File') && value)
    // @ts-ignore
    .map(([key, value]) => ({ 
        name: key.replace('File', '').replace(/([A-Z])/g, ' $1').replace('npwp', 'NPWP').trim(), 
        // @ts-ignore
        file: value as { name: string; type: string; dataUrl: string; }
    }));
  
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
            {/* Informasi Umum */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary flex items-center gap-2"><User /> Informasi Pengusul & Lembaga</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm p-4 border rounded-lg">
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
                  <div className="flex items-start gap-3">
                      <User className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                      <div>
                          <p className="font-medium">Nama Pengusul</p>
                          <p className="text-muted-foreground">{institution.proposerName}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                      <div>
                          <p className="font-medium">No. Ponsel Pengusul</p>
                          <p className="text-muted-foreground">{institution.proposerPhoneNumber}</p>
                      </div>
                  </div>
              </div>
            </div>

            {/* Informasi Usulan */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary flex items-center gap-2"><FileText /> Informasi Usulan</h4>
              <div className="p-4 border rounded-lg space-y-4">
                  <div>
                      <p className="font-medium">Keterangan Usulan</p>
                      <p className="text-muted-foreground text-sm mt-1">{institution.proposalDescription}</p>
                  </div>

                  {institution.activityPhoto && (
                      <div>
                          <p className="font-medium">Foto Plang / Kegiatan</p>
                          <div className="mt-2 rounded-lg overflow-hidden border">
                             <a href={institution.activityPhoto.dataUrl} target="_blank" rel="noopener noreferrer">
                                <img 
                                    src={institution.activityPhoto.dataUrl} 
                                    alt="Foto Kegiatan" 
                                    className="w-full h-auto object-cover max-h-64" 
                                />
                             </a>
                          </div>
                      </div>
                  )}
              </div>
            </div>
            
            {/* Legalitas */}
            {legalities.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2"><FileText /> Dokumen Legalitas</h4>
                <div className="p-4 border rounded-lg space-y-2">
                  {legalities.map(({ name, file }) => (
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

            {/* Pengurus */}
            {institution.boardMembers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary flex items-center gap-2"><Users /> Data Pengurus</h4>
                  <div className="space-y-4">
                    {institution.boardMembers.map((member, index) => (
                      <div key={index} className="p-4 border rounded-md">
                          <p className="font-semibold mb-2">{member.name} - <span className="font-normal text-muted-foreground">{member.position}</span></p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <p><strong className="text-card-foreground font-medium">NIK:</strong> {member.nik}</p>
                              <p><strong className="text-card-foreground font-medium">No. HP:</strong> {member.phoneNumber}</p>
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
