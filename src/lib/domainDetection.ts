export type RegionCode = 'global' | 'za' | 'gb' | 'pt' | 'th';

export interface RegionDomainConfig {
  code: RegionCode;
  domains: string[];
  isLive: boolean;
  redirectUrl?: string;
}

// Domain configuration for each region
export const regionDomains: RegionDomainConfig[] = [
  {
    code: 'za',
    domains: ['healingbuds.co.za', 'www.healingbuds.co.za'],
    isLive: true,
    redirectUrl: 'https://healingbuds.co.za',
  },
  {
    code: 'gb',
    domains: ['healingbuds.co.uk', 'www.healingbuds.co.uk'],
    isLive: false,
  },
  {
    code: 'pt',
    domains: ['healingbuds.pt', 'www.healingbuds.pt'],
    isLive: false,
  },
  {
    code: 'th',
    domains: ['healingbuds.co.th', 'www.healingbuds.co.th', 'healingbuds.th'],
    isLive: false,
  },
  {
    code: 'global',
    domains: ['healingbuds.com', 'www.healingbuds.com', 'healingbudsglobal.com'],
    isLive: true,
    redirectUrl: '/',
  },
];

/**
 * Detect the region based on the current hostname
 * Returns 'global' for development/preview URLs or unrecognized domains
 */
export const detectRegionFromDomain = (): RegionCode => {
  if (typeof window === 'undefined') return 'global';
  
  const hostname = window.location.hostname.toLowerCase();
  
  // Development and preview URLs
  if (
    hostname === 'localhost' ||
    hostname.includes('lovable.app') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('preview')
  ) {
    return 'global';
  }
  
  // Check for exact domain matches
  for (const config of regionDomains) {
    if (config.domains.includes(hostname)) {
      return config.code;
    }
  }
  
  // Check for subdomain patterns
  for (const config of regionDomains) {
    for (const domain of config.domains) {
      if (hostname.endsWith(`.${domain}`) || hostname.endsWith(domain)) {
        return config.code;
      }
    }
  }
  
  return 'global';
};

/**
 * Get the configuration for a specific region
 */
export const getRegionConfig = (code: RegionCode): RegionDomainConfig | undefined => {
  return regionDomains.find(r => r.code === code);
};

/**
 * Check if a region is live (has an active external domain)
 */
export const isRegionLive = (code: RegionCode): boolean => {
  const config = getRegionConfig(code);
  return config?.isLive ?? false;
};

/**
 * Get the external URL for a region
 */
export const getRegionExternalUrl = (code: RegionCode): string | null => {
  const config = getRegionConfig(code);
  if (!config || !config.isLive) return null;
  return config.redirectUrl || `https://${config.domains[0]}`;
};

/**
 * Map from internal country keys (used in InteractiveMap) to region codes
 */
export const countryKeyToRegionCode: Record<string, RegionCode> = {
  southAfrica: 'za',
  uk: 'gb',
  portugal: 'pt',
  thailand: 'th',
};

export const regionCodeToCountryKey: Record<RegionCode, string> = {
  za: 'southAfrica',
  gb: 'uk',
  pt: 'portugal',
  th: 'thailand',
  global: 'global',
};
