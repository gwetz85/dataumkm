export type Entrepreneur = {
  id: string;
  nik: string;
  kk: string;
  fullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  phoneNumber: string;
  address: string;
  businessType: string;
  businessLocation: string;
  coordinator: string;
  registrationDate: string;
  barcode: string;
};

export type BoardMember = {
  name: string;
  phoneNumber: string;
  nik: string;
  address: string;
  tenure: string;
};

export type LegalityFile = {
    name: string;
    type: string;
    dataUrl: string;
} | null;

export type Institution = {
  id: string;
  proposerName: string;
  proposerPhoneNumber: string;
  institutionName: string;
  institutionAddress: string;
  proposalDescription: string;
  activityPhoto: LegalityFile;
  legalities: {
      skLembaga: boolean;
      skLembagaFile: LegalityFile;
      skKemenkumham: boolean;
      skKemenkumhamFile: LegalityFile;
      npwpLembaga: boolean;
      npwpLembagaFile: LegalityFile;
      skKemenag: boolean;
      skKemenagFile: LegalityFile;
      suratDomisili: boolean;
      suratDomisiliFile: LegalityFile;
  };
  boardMembers: BoardMember[];
  registrationDate: string;
  barcode: string;
};
