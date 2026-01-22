export interface RegionalContentType {
  code: string;
  name: string;
  flag: string;
  language: string;
  currency: {
    code: string;
    symbol: string;
  };
  status: 'LIVE' | 'HQ' | 'PRODUCTION' | 'NEXT';
  statusDescription: string;
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  operations: {
    type: string;
    description: string;
  };
  services: string[];
  compliance: {
    body: string;
    certifications: string[];
  };
  features: string[];
  legalNote: string;
  regulatoryBody: string;
  externalUrl?: string;
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
    status: 'LIVE',
    statusDescription: 'Operational',
    hero: {
      title: 'Medical Cannabis for South Africa',
      subtitle: 'Bringing EU GMP-certified cannabis therapy to Southern Africa. Access world-class medical cannabis treatments with local clinical support.',
      cta: 'Check Eligibility',
    },
    operations: {
      type: 'Medical Clinic Network',
      description: 'Licensed medical cannabis consultations and prescription services through our South African clinic network.',
    },
    services: [
      'Online eligibility assessment',
      'Medical consultations',
      'Prescription fulfillment',
      'Patient support',
    ],
    compliance: {
      body: 'SAHPRA',
      certifications: ['EU GMP Products', 'Seed-to-Sale Tracking', 'Blockchain Traceability'],
    },
    features: [
      'SAHPRA Compliant Operations',
      'EU GMP Certified Products',
      'Licensed South African Clinicians',
      'Blockchain Traceability',
    ],
    legalNote: 'All products and services comply with SAHPRA (South African Health Products Regulatory Authority) regulations. A valid prescription is required for all medical cannabis products.',
    regulatoryBody: 'SAHPRA',
    externalUrl: 'https://healingbuds.co.za',
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
    status: 'HQ',
    statusDescription: 'Global Headquarters',
    hero: {
      title: 'Cannabis Medicinal para Portugal',
      subtitle: 'Sede global da Healing Buds com instalações de cultivo certificadas EU GMP e parcerias de investigação com universidades de referência mundial.',
      cta: 'Saber Mais',
    },
    operations: {
      type: 'Cultivation & Research Hub',
      description: 'EU GMP certified cultivation facility spanning over 18,000m² with pharmaceutical-grade processing and global distribution capabilities.',
    },
    services: [
      'EU GMP cultivation',
      'Pharmaceutical processing',
      'Global distribution',
      'Research partnerships',
    ],
    compliance: {
      body: 'INFARMED',
      certifications: ['EU GMP Manufacturing', 'Pharmaceutical License', 'GACP Certification'],
    },
    features: [
      'EU GMP Certified Headquarters',
      '18,000m² Cultivation Facility',
      'Research with Imperial College London',
      'Global Distribution Network',
    ],
    legalNote: 'All operations are regulated by INFARMED (Autoridade Nacional do Medicamento e Produtos de Saúde). Healing Buds Portugal serves as the global cultivation and distribution headquarters.',
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
    status: 'NEXT',
    statusDescription: 'Coming Soon',
    hero: {
      title: 'Medical Cannabis for the UK',
      subtitle: 'Private specialist medical cannabis consultations coming soon. Register your interest to be notified when our UK services launch.',
      cta: 'Register Interest',
    },
    operations: {
      type: 'Private Clinic Network',
      description: 'Specialist medical cannabis consultations through our planned UK private clinic network, launching soon.',
    },
    services: [
      'Private specialist consultations',
      'Prescription services',
      'Patient care coordination',
      'Ongoing support',
    ],
    compliance: {
      body: 'CQC / MHRA',
      certifications: ['CQC Registration (Planned)', 'MHRA Compliance', 'EU GMP Products'],
    },
    features: [
      'CQC & MHRA Framework',
      'UK Registered Specialists',
      'Private Prescription Service',
      'Harley Street Network (Planned)',
    ],
    legalNote: 'UK services are currently in development. All future products and services will comply with UK regulations for medical cannabis as determined by the CQC and MHRA.',
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
    status: 'PRODUCTION',
    statusDescription: 'Manufacturing Operations',
    hero: {
      title: 'Medical Cannabis for Thailand',
      subtitle: 'Combining traditional Thai medicine with modern EU GMP-certified cannabis treatments. Manufacturing and clinic operations in Bangkok.',
      cta: 'Register Interest',
    },
    operations: {
      type: 'Production & Clinic Network',
      description: 'Thai FDA approved manufacturing facility with integrated clinic operations, combining traditional medicine with modern cannabis therapeutics.',
    },
    services: [
      'Manufacturing operations',
      'Medical consultations',
      'Traditional medicine integration',
      'Regional distribution',
    ],
    compliance: {
      body: 'Thai FDA',
      certifications: ['Thai FDA Approved', 'EU GMP Standards', 'Traditional Medicine License'],
    },
    features: [
      'Thai FDA Approved Operations',
      'Manufacturing Facility',
      'Bilingual Medical Staff',
      'Traditional Medicine Integration',
    ],
    legalNote: 'All products and services are approved by the Thai Food and Drug Administration (FDA). Medical cannabis is legal in Thailand for approved therapeutic uses.',
    regulatoryBody: 'Thai FDA',
  },
};

export const getRegionalContent = (regionCode: string): RegionalContentType | null => {
  const code = regionCode.toLowerCase();
  return regionalContent[code] || null;
};
