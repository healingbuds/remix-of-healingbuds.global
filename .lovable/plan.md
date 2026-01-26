

# Fix GlobalMapHub Header and Map Tile Visibility

## Summary
Two issues need to be fixed on the GlobalMapHub page (the map/regional landing at `/`):
1. **Header needs dark teal styling** (matching the main site) instead of white glassmorphism
2. **Map tiles not visible in light mode** - tiles are loading but blending with the background

---

## Issue 1: Header Styling on GlobalMapHub

### Current Behavior
The GlobalMapHub page has a glassmorphism header that changes based on theme:
- Light mode: `bg-white/70` with green logo
- Dark mode: `bg-black/30` with white logo

### Desired Behavior
Use the same dark teal header styling as the main site - consistent branding regardless of theme mode.

### Changes Required

**File:** `src/pages/GlobalMapHub.tsx`

| Line | Current | Change To |
|------|---------|-----------|
| 98-99 | Theme-adaptive header bg | Fixed dark teal header |
| 135 | `${headerBg} backdrop-blur-xl border ${headerBorder}` | `bg-[hsl(178,48%,21%)] border-white/10` |
| 139 | `isDark ? hbLogoWhite : hbLogoGreen` | `hbLogoWhite` (always white) |
| 151 | Theme-adaptive button colors | White text for dark header |

**Detailed Changes:**

1. **Line 98-99** - Remove theme-adaptive header colors:
```typescript
// REMOVE these lines:
const headerBg = isDark ? 'bg-black/30' : 'bg-white/70';
const headerBorder = isDark ? 'border-white/10' : 'border-black/10';
```

2. **Line 135** - Use fixed dark teal header:
```typescript
// FROM:
className={`flex items-center justify-between px-4 py-3 md:px-6 md:py-4 rounded-2xl ${headerBg} backdrop-blur-xl border ${headerBorder} shadow-2xl`}

// TO:
className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-[hsl(178,48%,21%)] backdrop-blur-xl border border-white/10 shadow-2xl"
```

3. **Line 139** - Always use white logo:
```typescript
// FROM:
src={isDark ? hbLogoWhite : hbLogoGreen}

// TO:
src={hbLogoWhite}
```

4. **Lines 148-157** - Update button colors for dark header:
```typescript
// FROM:
className={`hidden sm:flex ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-foreground/70 hover:text-foreground hover:bg-black/5'} text-sm`}

// TO:
className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/10 text-sm"
```

---

## Issue 2: Map Tiles Not Visible in Light Mode

### Root Cause Analysis
Looking at the user's screenshot, the map tiles aren't rendering. Possible causes:
1. Tile loading issue - tiles may not be fetching
2. Z-index layering - overlays may be covering tiles
3. Background matching tile colors making them invisible

### Solution
Add explicit visibility and z-index fixes to ensure tiles render properly:

**File:** `src/styles/leaflet-premium.css`

Add explicit visibility rules for the tile pane and ensure proper z-index stacking:

```css
/* Ensure tile pane is always visible */
.leaflet-tile-pane {
  opacity: 1 !important;
  visibility: visible !important;
}

/* Ensure tiles have proper z-index */
.leaflet-layer {
  z-index: 1;
}
```

**File:** `src/components/PremiumLeafletMap.tsx`

Add a check to invalidate map size after container is mounted (lines 465-473):

```typescript
// Force map invalidation on mount
useEffect(() => {
  if (mapRef.current && mapReady) {
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 500);
  }
}, [mapReady]);
```

---

## Files to Modify

| File | Lines | Change Description |
|------|-------|-------------------|
| `src/pages/GlobalMapHub.tsx` | 98-99, 135, 139, 151 | Fixed dark teal header, white logo, white button text |
| `src/styles/leaflet-premium.css` | 467-475 | Add explicit tile visibility rules |
| `src/components/PremiumLeafletMap.tsx` | After line 483 | Add invalidateSize call after map ready |

---

## Expected Result

After these changes:
1. **Header** - GlobalMapHub will have the same dark teal header as the main site (white logo, consistent branding)
2. **Map tiles** - Will render correctly in both light and dark modes with explicit visibility rules

