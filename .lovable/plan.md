

# Fix Global Homepage Issues: Map Visibility + London Address

## Issues Identified

### Issue 1: London Address Showing Instead of Portugal HQ
**Root Cause:** The `useGeoLocation` hook in `src/hooks/useGeoLocation.ts` falls back to language-based detection when domain detection returns `null`. On iOS devices, the browser language is often detected as `en-GB` rather than plain `en`, which maps to the UK (GB) configuration showing the London address.

**Location:** `src/hooks/useGeoLocation.ts` lines 117-127

```text
Current mapping:
en → DEFAULT (Portugal) ✓
en-GB → GB (UK/London) ← Problem on iOS
en-US → US
en-ZA → ZA
```

**Fix:** Update the language mapping so that all generic English variants (`en-GB`, `en-AU`, etc.) default to the Portugal Global HQ, rather than regional addresses. Only domain-based detection should trigger regional content.

### Issue 2: Map Not Visible on iOS
**Root Cause:** Multiple potential causes for Leaflet map tiles not rendering on iOS:

1. **Viewport Height Issues:** iOS Safari has dynamic viewport height that can cause Leaflet to miscalculate container size
2. **CSS Transform/GPU Acceleration:** iOS can struggle with complex CSS animations during initial render
3. **Delayed Invalidation:** The current invalidation timers (100ms, 400ms, 900ms) may not be sufficient for slower iOS devices

**Locations:**
- `src/pages/GlobalMapHub.tsx` lines 103-112
- `src/components/PremiumLeafletMap.tsx` lines 505-515

---

## Proposed Changes

### File 1: `src/hooks/useGeoLocation.ts`

**Change 1:** Update language-to-country mapping to default ALL English variants to Portugal HQ (lines 117-127)

```typescript
// Before:
const languageToCountry: Record<string, string> = {
  pt: 'PT',
  'pt-PT': 'PT',
  'pt-BR': 'PT',
  en: 'DEFAULT',
  'en-GB': 'GB',      // ← Shows London on iOS
  'en-US': 'US',
  'en-ZA': 'ZA',
  th: 'TH',
  'th-TH': 'TH',
};

// After:
const languageToCountry: Record<string, string> = {
  pt: 'PT',
  'pt-PT': 'PT',
  'pt-BR': 'PT',
  en: 'DEFAULT',
  'en-GB': 'DEFAULT',  // ← All English → Portugal HQ
  'en-US': 'DEFAULT',  // ← Domain detection handles regional
  'en-ZA': 'DEFAULT',  // ← Domain detection handles regional
  'en-AU': 'DEFAULT',  // ← Add Australian English
  'en-IE': 'DEFAULT',  // ← Add Irish English
  th: 'TH',
  'th-TH': 'TH',
};
```

**Rationale:** Domain-based detection (`getCountryFromDomain`) is the authoritative source for regional content. Language preference should NOT override this - a user in the UK using healingbuds.global should see Portugal HQ details, not London.

---

### File 2: `src/components/PremiumLeafletMap.tsx`

**Change 2:** Improve iOS map tile rendering reliability (around line 505-520)

```typescript
// Before:
useEffect(() => {
  if (mapRef.current && mapReady) {
    const t1 = window.setTimeout(() => mapRef.current?.invalidateSize(), 100);
    const t2 = window.setTimeout(() => mapRef.current?.invalidateSize(), 400);
    const t3 = window.setTimeout(() => mapRef.current?.invalidateSize(), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }
}, [mapReady]);

// After (add more aggressive invalidation for iOS):
useEffect(() => {
  if (mapRef.current && mapReady) {
    // Immediate invalidation
    mapRef.current.invalidateSize();
    
    // Staggered invalidations for layout completion
    const t1 = window.setTimeout(() => mapRef.current?.invalidateSize(), 100);
    const t2 = window.setTimeout(() => mapRef.current?.invalidateSize(), 300);
    const t3 = window.setTimeout(() => mapRef.current?.invalidateSize(), 600);
    const t4 = window.setTimeout(() => mapRef.current?.invalidateSize(), 1000);
    // iOS Safari sometimes needs longer delay
    const t5 = window.setTimeout(() => mapRef.current?.invalidateSize(), 1500);
    
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
    };
  }
}, [mapReady]);
```

**Change 3:** Add iOS-specific viewport fix in map container (around line 545-560)

```typescript
// Update the container style to use dvh (dynamic viewport height) for iOS
<div 
  ref={mapContainerRef} 
  className="absolute inset-0 w-full h-full touch-pan-x touch-pan-y"
  style={{ 
    background: mapBg,
    minHeight: '100dvh', // iOS dynamic viewport height
    height: '100%',
  }}
/>
```

---

### File 3: `src/pages/GlobalMapHub.tsx`

**Change 4:** Add iOS viewport meta and force visibility (around line 103)

Update the container to ensure proper iOS viewport handling:

```typescript
// Before:
<div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: bgColor }}>

// After (add iOS-safe height):
<div 
  className="fixed inset-0 overflow-hidden" 
  style={{ 
    backgroundColor: bgColor,
    height: '100dvh', // Dynamic viewport height for iOS
    minHeight: '-webkit-fill-available', // iOS Safari fallback
  }}
>
```

---

### File 4: `src/styles/leaflet-premium.css`

**Change 5:** Add iOS-specific tile rendering fixes (append to end of file)

```css
/* iOS Safari tile rendering fixes */
@supports (-webkit-touch-callout: none) {
  .leaflet-container {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  
  .leaflet-tile-container {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  
  .leaflet-tile-pane {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  
  .leaflet-tile {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}

/* Ensure map visibility on mobile devices */
@media (max-width: 768px) {
  .leaflet-container {
    min-height: 100dvh;
    min-height: -webkit-fill-available;
  }
  
  .leaflet-tile-pane,
  .leaflet-overlay-pane,
  .leaflet-marker-pane {
    opacity: 1 !important;
    visibility: visible !important;
  }
}

/* Light mode marker visibility enhancement */
:root .premium-marker {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
}

/* Dark mode marker glow */
.dark .premium-marker {
  filter: drop-shadow(0 0 12px hsl(175, 42%, 40%));
}

/* Flight path visibility - light mode */
:root .flight-path {
  opacity: 0.75 !important;
}

:root .flight-path-glow {
  opacity: 0.18 !important;
}
```

---

## Summary of Changes

| File | Change | Purpose |
|------|--------|---------|
| `useGeoLocation.ts` | Map all English variants to DEFAULT | Fixes London address on iOS - always show Portugal HQ for .global domain |
| `PremiumLeafletMap.tsx` | Add more invalidation timers + immediate call | Ensures tiles render on slower iOS devices |
| `PremiumLeafletMap.tsx` | Add `100dvh` to container | iOS dynamic viewport height support |
| `GlobalMapHub.tsx` | Add iOS-safe height styles | Prevents viewport calculation issues |
| `leaflet-premium.css` | Add iOS GPU acceleration and visibility fixes | Forces tile/marker rendering on iOS Safari |

---

## Expected Results

1. **Address Fix:** All users visiting healingbuds.global (or preview URLs) will see Portugal HQ address regardless of their browser language setting
2. **Map Fix:** Map tiles and markers will reliably render on iOS devices with:
   - Proper viewport sizing
   - GPU-accelerated rendering
   - Multiple invalidation passes for layout stability

