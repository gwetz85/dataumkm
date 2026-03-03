export type Entrepreneur = {
  id: string;
  nik: string;
  noKK: string;
  fullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  businessType: string;
  businessLocation: string;
  accountNumber: string;
  bankName: string;
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

export type NIB = {
  id: string;
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  businessType: string;
  businessName: string;
  businessLocation: string;
  businessCapital: string;
  businessDuration: string;
  registrationDate: string;
  barcode: string;
};

export type HalalPersonData = {
  name: string;
  nik: string;
  gender: 'Laki-laki' | 'Perempuan';
  phoneNumber: string;
  email: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  postalCode: string;
};

export type HalalFactoryData = {
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  postalCode: string;
};

export type HalalCertification = {
  id: string;
  barcode: string;
  registrationDate: string;
  
  businessOwner: HalalPersonData;
  personInCharge: HalalPersonData;
  factory: HalalFactoryData;

  businessActivity: {
    businessName: string;
    businessType: string;
    businessCapital: string;
    income: string;
    businessDuration: string;
    productMarketing: string;
  };

  ingredients: string;
  equipmentCleaning: string;
  packaging: string;
  processingMethod: string;

  nibCheck: {
    nibNumber: string;
    kbli: string;
    productResult: string;
  };

  siHalalAccount: {
    email: string;
    password: string;
    accountStatus: string;
  };
};
