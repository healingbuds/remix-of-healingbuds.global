
# Fix Map Visibility, Navigation, and Branding Issues

## Summary
This plan addresses four key issues:
1. **Map not visible** on the GlobalMapHub page (root `/` route)
2. **Remove globe icon** from the GlobalMapHub header
3. **Remove standalone Franchise button** from navigation (keep it in About Us dropdown only)
4. **Rename "Franchise Opportunities" to "Partners"** throughout the site

---

## Issues Analysis

### Issue 1: Map Not Visible
The GlobalMapHub page loads the map with a delay (`setTimeout(() => setMapReady(true), 100)`). The map component appears correctly structured, but the issue may be related to:
- Leaflet CSS not loading properly in light mode
- The welcome overlay blocking interaction
- Theme-related visibility issues

After reviewing the code, the map tiles and container should render. The most likely cause is that the map container needs explicit height, or there's a CSS conflict. The `PremiumLeafletMap` uses `mapContainerRef` with the parent having `absolute inset-0`, which should work.

### Issue 2: Globe Icon in Header
The `GlobalMapHub.tsx` header (lines 138-145) includes a `PremiumGlobeIcon` next to the logo. This needs to be removed.

### Issue 3: Franchise Button in Navigation
Currently, there's a standalone "Franchise" link in:
- `NavigationMenu.tsx` (line 285-287) - Desktop
- `NavigationOverlay.tsx` (lines 385-401) - Mobile

These should be removed since the previous plan was to move Franchise into the About Us dropdown.

### Issue 4: Rename to "Partners"
All references to "Franchise Opportunities" should become "Partners":
- Page title and breadcrumbs
- Navigation labels
- Footer links
- FranchiseCTA component
- Translation files (both EN and PT)
- Route can stay `/franchise-opportunities` or change to `/partners`

---

## Changes Required

### 1. Fix Map Visibility (`src/pages/GlobalMapHub.tsx`)
Ensure the map container has proper dimensions and z-index ordering. The issue may be in the stacking context.

**Change lines 107-115:**
```tsx
{/* Full-screen Premium Leaflet Map */}
<div className="absolute inset-0 z-0" style={{ minHeight: '100vh' }}>
  {mapReady && (
    <PremiumLeafletMap 
      selectedCountry={selectedCountry}
      onCountrySelect={handleCountrySelect}
    />
  )}
</div>
```

Also verify the map container in `PremiumLeafletMap.tsx` has proper height.

---

### 2. Remove Globe Icon from Header (`src/pages/GlobalMapHub.tsx`)

**Current (lines 138-145):**
```tsx
<Link to="/home" className="flex items-center gap-2 md:gap-3 group">
  <PremiumGlobeIcon size="sm" animate />
  <img 
    src={isDark ? hbLogoWhite : hbLogoGreen} 
    alt="Healing Buds" 
    className="h-6 md:h-8 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
  />
</Link>
```

**Change to:**
```tsx
<Link to="/home" className="flex items-center group">
  <img 
    src={isDark ? hbLogoWhite : hbLogoGreen} 
    alt="Healing Buds" 
    className="h-6 md:h-8 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
  />
</Link>
```

Also remove the import for `PremiumGlobeIcon` if no longer used elsewhere.

---

### 3. Remove Franchise Button from Map Header (`src/pages/GlobalMapHub.tsx`)

**Current (lines 161-170):**
```tsx
<Button 
  size="sm"
  className="bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20"
  asChild
>
  <Link to="/franchise-opportunities">
    <Building2 className="mr-1.5 w-4 h-4" />
    <span className="hidden sm:inline">Franchise</span>
    <span className="sm:hidden">Partner</span>
  </Link>
</Button>
```

**Remove this entire button block.**

---

### 4. Remove Standalone Franchise Links from Navigation

**Desktop (`src/components/NavigationMenu.tsx`):**

Delete lines 285-287:
```tsx
<Link to="/franchise-opportunities" className={getNavItemStyles(isActive("/franchise-opportunities"))}>
  {t('nav.franchise')}
</Link>
```

**Mobile (`src/components/NavigationOverlay.tsx`):**

Delete lines 385-401 (the franchise-opportunities Link block).

---

### 5. Add Partners to About Us Dropdown

**Desktop (`src/components/NavigationMenu.tsx`):**

Update the About Us dropdown array (lines 248-251):
```tsx
{[
  { to: '/about-us', label: 'aboutHealing', desc: 'aboutHealingDesc' },
  { to: '/blockchain-technology', label: 'blockchain', desc: 'blockchainDesc' },
  { to: '/franchise-opportunities', label: 'partners', desc: 'partnersDesc' }
].map(...)}
```

Update active state detection (line 41):
```tsx
const isAboutUsActive = ['/about-us', '/blockchain-technology', '/franchise-opportunities'].includes(location.pathname);
```

**Mobile (`src/components/NavigationOverlay.tsx`):**

Update the About Us dropdown array (lines 359-362):
```tsx
{[
  { to: '/about-us', label: 'aboutHealing' },
  { to: '/blockchain-technology', label: 'blockchain' },
  { to: '/franchise-opportunities', label: 'partners' }
].map(...)}
```

Update active state detection (line 50):
```tsx
const isAboutUsActive = ['/about-us', '/blockchain-technology', '/franchise-opportunities'].includes(location.pathname);
```

---

### 6. Update Translation Files

**English (`src/i18n/locales/en/common.json`):**

Add to dropdown section:
```json
"dropdown": {
  ...
  "partners": "Partners",
  "partnersDesc": "Partner with us globally"
}
```

Update nav section:
```json
"nav": {
  ...
  "franchise": "Partners"
}
```

Update footer section:
```json
"footer": {
  ...
  "franchiseOpportunities": "Partners"
}
```

Update franchiseCTA section:
```json
"franchiseCTA": {
  "badge": "B2B Partnership Opportunity",
  "headline": "Join the Medical Cannabis Revolution",
  "subheadline": "Partner with an EU GMP-certified leader to bring pharmaceutical-grade medical cannabis to your market.",
  "feature1": "Turnkey Operations",
  "feature2": "Global Expertise",
  "feature3": "Regulatory Support",
  "cta": "Become a Partner"
}
```

**Portuguese (`src/i18n/locales/pt/common.json`):**

Add to dropdown section:
```json
"dropdown": {
  ...
  "partners": "Parceiros",
  "partnersDesc": "Parceria global connosco"
}
```

Update nav section:
```json
"nav": {
  ...
  "franchise": "Parceiros"
}
```

Update footer section:
```json
"footer": {
  ...
  "franchiseOpportunities": "Parceiros"
}
```

Update franchiseCTA section:
```json
"franchiseCTA": {
  "badge": "Oportunidade de Parceria B2B",
  "headline": "Junte-se à Revolução da Cannabis Medicinal",
  "subheadline": "Parceria com um líder certificado EU GMP para trazer cannabis medicinal de grau farmacêutico ao seu mercado.",
  "feature1": "Operações Prontas",
  "feature2": "Expertise Global",
  "feature3": "Suporte Regulatório",
  "cta": "Torne-se Parceiro"
}
```

---

### 7. Update FranchiseOpportunities Page (`src/pages/FranchiseOpportunities.tsx`)

Update page title and headings (lines 185-189):
```tsx
<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
  Partners
</h1>
<p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl font-light">
  Join the Healing Buds network and bring regulated medical cannabis healthcare to your region.
</p>
```

Update SEO title (lines 167-170):
```tsx
<SEOHead 
  title="Partners | Healing Buds Global"
  description="Join the Healing Buds partner network. Partner with an established EU GMP certified medical cannabis company and enter the growing healthcare market."
/>
```

---

### 8. Update FranchiseCTA Component (`src/components/FranchiseCTA.tsx`)

The CTA button link stays the same (`/franchise-opportunities`), but text comes from translations which will now say "Partners".

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/GlobalMapHub.tsx` | Remove globe icon, remove franchise button, fix map z-index |
| `src/components/NavigationMenu.tsx` | Remove standalone franchise link, add to About dropdown, update active states |
| `src/components/NavigationOverlay.tsx` | Remove standalone franchise link, add to About dropdown, update active states |
| `src/i18n/locales/en/common.json` | Add partners translations, update franchise → partners |
| `src/i18n/locales/pt/common.json` | Add Portuguese partners translations |
| `src/pages/FranchiseOpportunities.tsx` | Update page title and SEO to "Partners" |

---

## Result

After these changes:
- The map will be visible with proper z-index ordering
- No globe icon next to the logo in the GlobalMapHub header
- No Franchise button in the GlobalMapHub header actions
- "Partners" replaces "Franchise Opportunities" in:
  - Navigation dropdown (under About Us)
  - Footer
  - FranchiseCTA component
  - Page title and SEO
- Route stays `/franchise-opportunities` for backward compatibility (can be changed to `/partners` if preferred)
