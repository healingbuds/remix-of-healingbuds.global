
# Fix Map Visibility and London Address Issues

## Summary
Two critical issues need to be resolved:
1. Map tiles not rendering on the GlobalMapHub page
2. London (UK) address incorrectly showing on .global home page instead of Portugal HQ

---

## Issue 1: Map Not Visible

### Root Cause
The Leaflet map tiles are not loading properly. Looking at the user's screenshot, the connection lines and region buttons are visible, but the map tiles themselves are blank/missing.

### Diagnosis
The map uses CARTO tile provider (`basemaps.cartocdn.com`). Possible causes:
- Tile loading CSS transition causing initial blank state
- Z-index layering issues
- Tile provider connection issues

### Solution
1. **Update tile loading CSS** in `src/styles/leaflet-premium.css`:
   - Remove the opacity transition that starts tiles at opacity 0
   - Ensure tiles are visible immediately on load

2. **Improve map container reliability** in `src/components/PremiumLeafletMap.tsx`:
   - Add explicit size check before initializing map
   - Force map invalidation after render

### Files to Modify
| File | Change |
|------|--------|
| `src/styles/leaflet-premium.css` | Lines 436-448 - Fix tile opacity/visibility |
| `src/components/PremiumLeafletMap.tsx` | Add container size validation |

---

## Issue 2: London Address on .global Domain

### Root Cause
The `useGeoLocation` hook in `src/hooks/useGeoLocation.ts` has this logic:

1. First, it checks domain-based detection (line 161)
2. For Lovable preview domains, it returns `null` (line 136)
3. It then falls back to language-based detection (lines 168-174)
4. The language mapping on line 121 sets `en: 'GB'`

This means any English-speaking browser on the Lovable preview (or .global domain) defaults to UK/London.

### Solution
Update the `languageToCountry` mapping to map generic `en` to the global DEFAULT (Portugal HQ) instead of UK:

```typescript
const languageToCountry: Record<string, string> = {
  pt: 'PT',
  'pt-PT': 'PT',
  'pt-BR': 'PT',
  // Generic English → DEFAULT (Portugal Global HQ)
  en: 'DEFAULT',  // Changed from 'GB'
  'en-GB': 'GB',  // Specific UK English still maps to UK
  'en-US': 'US',
  'en-ZA': 'ZA',
  th: 'TH',
  'th-TH': 'TH',
};
```

### Files to Modify
| File | Change |
|------|--------|
| `src/hooks/useGeoLocation.ts` | Line 121 - Change `en: 'GB'` to `en: 'DEFAULT'` |

---

## Technical Details

### CSS Fix for Tile Loading
```css
/* Current problematic code (lines 436-448) */
.leaflet-tile {
  opacity: 0;  /* <- Tiles start invisible */
  transition: opacity 0.4s ease-out, filter 0.3s ease-out;
}

.leaflet-tile-loaded {
  opacity: 1;
  animation: tile-fade-in 0.5s ease-out forwards;
}

/* Fixed version */
.leaflet-tile {
  opacity: 1;  /* <- Tiles visible immediately */
}

.leaflet-tile-loaded {
  opacity: 1;
}
```

### GeoLocation Language Mapping Fix
```typescript
// Line 121 - Before:
en: 'GB',

// Line 121 - After:
en: 'DEFAULT',
```

---

## Expected Result

After these changes:
1. **Map tiles will load immediately** without the opacity transition causing blank states
2. **Global/preview domains** will show Portugal HQ address (Avenida D. Joao II, Lisboa)
3. **UK-specific English** (en-GB) still correctly shows London address
4. **Other regional domains** (.co.za, .co.uk, .co.th) continue working as before

---

## Files Summary

| File | Lines | Change Description |
|------|-------|-------------------|
| `src/styles/leaflet-premium.css` | 436-448 | Remove opacity transition on tiles |
| `src/hooks/useGeoLocation.ts` | 121 | Change `en: 'GB'` to `en: 'DEFAULT'` |
