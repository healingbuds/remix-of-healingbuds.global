export interface RegionalContentType {
  code: string;
  name: string;
  flag: string;
  language: string;
  currency: {
    code: string;
    symbol: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  clinic: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
  };
  features: string[];
  legalNote: string;
  pricing: {
    consultation: number;
    treatmentMin: number;
    treatmentMax: number;
  };
  regulatoryBody: string;
}

export const regionalContent: Record<string, RegionalContentType> = {
  za: {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    language: 'English',
    currency: {
      code: 'ZAR',
      symbol: 'R',
    },
    hero: {
      title: 'Medical Cannabis for South Africa',
      subtitle: 'Bringing EU GMP-certified cannabis therapy to Southern Africa. Access world-class medical cannabis treatments with local clinical support.',
      cta: 'Register Your Interest',
    },
    clinic: {
      name: 'Healing Buds Sandton',
      address: '123 Sandton Drive',
      city: 'Sandton, Johannesburg 2196',
      phone: '+27 11 123 4567',
      email: 'info@healingbuds.co.za',
    },
    features: [
      'SAHPRA Compliant',
      'EU GMP Certified Products',
      'Local South African Clinicians',
      'Secure Prescription Delivery',
    ],
    legalNote: 'All products and services are approved under SAHPRA (South African Health Products Regulatory Authority) regulations. A valid prescription is required for all medical cannabis products.',
    pricing: {
      consultation: 2500,
      treatmentMin: 4500,
      treatmentMax: 8000,
    },
    regulatoryBody: 'SAHPRA',
  },
  pt: {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    language: 'Portuguese',
    currency: {
      code: 'EUR',
      symbol: '€',
    },
    hero: {
      title: 'Cannabis Medicinal para Portugal',
      subtitle: 'Soluções de canábis medicinal certificadas pela UE GMP. Aceda a tratamentos de canábis medicinal de classe mundial com apoio clínico local.',
      cta: 'Registar Interesse',
    },
    clinic: {
      name: 'Healing Buds Lisboa',
      address: 'Avenida da Liberdade, 245',
      city: 'Lisboa 1250-143',
      phone: '+351 21 123 4567',
      email: 'info@healingbuds.pt',
    },
    features: [
      'Aprovado pelo INFARMED',
      'Certificação EU GMP',
      'Médicos Portugueses Especializados',
      'Entrega Segura de Prescrições',
    ],
    legalNote: 'Todos os produtos e serviços são aprovados pelo INFARMED (Autoridade Nacional do Medicamento e Produtos de Saúde). É necessária uma prescrição válida para todos os produtos de canábis medicinal.',
    pricing: {
      consultation: 150,
      treatmentMin: 250,
      treatmentMax: 450,
    },
    regulatoryBody: 'INFARMED',
  },
  gb: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    language: 'English',
    currency: {
      code: 'GBP',
      symbol: '£',
    },
    hero: {
      title: 'Medical Cannabis for the UK',
      subtitle: 'Access EU GMP-certified medical cannabis treatments through our Harley Street clinic. Expert care from UK-registered specialists.',
      cta: 'Register Your Interest',
    },
    clinic: {
      name: 'Healing Buds Harley Street',
      address: '10 Harley Street',
      city: 'London W1G 9PF',
      phone: '+44 20 7123 4567',
      email: 'info@healingbuds.co.uk',
    },
    features: [
      'CQC Registered Clinic',
      'EU GMP Certified Products',
      'UK Registered Specialists',
      'Private Prescription Service',
    ],
    legalNote: 'All products and services comply with UK regulations for medical cannabis. Treatment is available for qualifying conditions as determined by a registered specialist. A private prescription is required.',
    pricing: {
      consultation: 150,
      treatmentMin: 200,
      treatmentMax: 400,
    },
    regulatoryBody: 'CQC / MHRA',
  },
  th: {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    language: 'Thai / English',
    currency: {
      code: 'THB',
      symbol: '฿',
    },
    hero: {
      title: 'Medical Cannabis for Thailand',
      subtitle: 'Combining traditional Thai medicine with modern EU GMP-certified cannabis treatments. Experience holistic healing in Bangkok.',
      cta: 'Register Your Interest',
    },
    clinic: {
      name: 'Healing Buds Bangkok',
      address: '55 Sukhumvit Road, Khlong Toei',
      city: 'Bangkok 10110',
      phone: '+66 2 123 4567',
      email: 'info@healingbuds.co.th',
    },
    features: [
      'Thai FDA Approved',
      'EU GMP Products',
      'Bilingual Medical Staff',
      'Traditional Medicine Integration',
    ],
    legalNote: 'All products and services are approved by the Thai Food and Drug Administration (FDA). Medical cannabis is legal in Thailand for approved therapeutic uses.',
    pricing: {
      consultation: 3000,
      treatmentMin: 5000,
      treatmentMax: 10000,
    },
    regulatoryBody: 'Thai FDA',
  },
};

export const getRegionalContent = (regionCode: string): RegionalContentType | null => {
  const code = regionCode.toLowerCase();
  return regionalContent[code] || null;
};
