export interface GlobalContentType {
  title: string;
  subtitle: string;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
  stats: {
    label: string;
    value: string;
  }[];
  ctaPrimary: string;
  ctaSecondary: string;
}

export const globalContent: GlobalContentType = {
  title: 'Welcome to Healing Buds Global',
  subtitle: 'The world\'s premier medical cannabis platform',
  description: 'Healing Buds provides EU GMP-certified medical cannabis solutions across multiple continents. Our integrated network of clinics, cultivation facilities, and pharmacies delivers safe, effective treatments to patients worldwide.',
  features: [
    {
      title: 'Seed-to-Sale Traceability',
      description: 'Blockchain-powered tracking ensures complete transparency from cultivation to patient delivery.',
    },
    {
      title: 'EU GMP Certification',
      description: 'All products meet the highest European pharmaceutical manufacturing standards.',
    },
    {
      title: 'Global Clinic Network',
      description: 'Access specialist consultations through our expanding network of licensed medical facilities.',
    },
    {
      title: 'Regulatory Excellence',
      description: 'Fully compliant operations in every jurisdiction we serve, with local regulatory partnerships.',
    },
  ],
  stats: [
    { label: 'Countries', value: '4+' },
    { label: 'Medical Partners', value: '50+' },
    { label: 'Patients Served', value: '10,000+' },
    { label: 'Product Lines', value: '25+' },
  ],
  ctaPrimary: 'Continue to Site',
  ctaSecondary: 'Franchise Opportunities',
};
