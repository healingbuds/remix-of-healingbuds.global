// Centralized configuration for breadcrumb labels and parent-child relationships

export interface BreadcrumbConfigItem {
  label: string;
  parent?: string;
}

export const breadcrumbConfig: Record<string, BreadcrumbConfigItem> = {
  '/': { label: 'breadcrumbs.home' },
  '/about-us': { label: 'nav.aboutUs' },
  '/blockchain-technology': { label: 'dropdown.blockchain', parent: '/about-us' },
  '/what-we-do': { label: 'nav.whatWeDo' },
  '/cultivating-processing': { label: 'dropdown.cultivating', parent: '/what-we-do' },
  '/manufacture-distribution': { label: 'dropdown.manufacture', parent: '/what-we-do' },
  '/medical-clinics': { label: 'dropdown.clinics', parent: '/what-we-do' },
  '/online-pharmacy': { label: 'dropdown.pharmacy', parent: '/what-we-do' },
  '/conditions': { label: 'footer.conditionsTreated' },
  '/the-wire': { label: 'nav.theWire' },
  '/research': { label: 'nav.research' },
  '/contact': { label: 'nav.contactUs' },
  '/franchise-opportunities': { label: 'footer.franchiseOpportunities' },
  '/privacy-policy': { label: 'footer.privacyPolicy' },
  '/terms-of-service': { label: 'footer.termsOfService' },
};

// Helper function to build breadcrumb trail from current path
export const buildBreadcrumbTrail = (pathname: string): { path: string; labelKey: string }[] => {
  const trail: { path: string; labelKey: string }[] = [];
  
  // Always start with home
  trail.push({ path: '/', labelKey: 'breadcrumbs.home' });
  
  // Handle dynamic routes (e.g., /the-wire/:id, /conditions/:id)
  let normalizedPath = pathname;
  
  // Check for dynamic article routes
  if (pathname.startsWith('/the-wire/') && pathname !== '/the-wire') {
    normalizedPath = '/the-wire';
  } else if (pathname.startsWith('/conditions/') && pathname !== '/conditions') {
    normalizedPath = '/conditions';
  }
  
  // Get current page config
  const currentConfig = breadcrumbConfig[normalizedPath];
  
  if (currentConfig) {
    // Build parent chain
    const parentChain: { path: string; labelKey: string }[] = [];
    let currentPath = normalizedPath;
    
    while (currentPath && breadcrumbConfig[currentPath]?.parent) {
      const parentPath = breadcrumbConfig[currentPath].parent!;
      const parentConfig = breadcrumbConfig[parentPath];
      if (parentConfig) {
        parentChain.unshift({ path: parentPath, labelKey: parentConfig.label });
      }
      currentPath = parentPath;
    }
    
    // Add parent chain
    trail.push(...parentChain);
    
    // Add current page
    trail.push({ path: normalizedPath, labelKey: currentConfig.label });
  }
  
  return trail;
};
