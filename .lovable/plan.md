

# Mobile Country Tabs Optimization - Global Healthcare Network Page

## Issue Summary
The country tabs at the bottom of the Global Healthcare Network page are not symmetrically displayed on mobile devices. They appear jumbled, left-aligned, and may not all fit on screen without scrolling.

---

## Current State Analysis

**File:** `src/pages/GlobalMapHub.tsx` (lines 248-297)

Current mobile implementation:
- Uses `overflow-x-auto` with horizontal scrolling
- Tabs are left-aligned (`justify-start`)
- Abbreviated names (SA, PT, TH, UK) are used on mobile
- Status labels are hidden on mobile (good for space)
- Gap between tabs: `gap-1.5` on mobile

Problems:
- Left-alignment breaks visual symmetry
- Scrolling is unnecessary if all 4 tabs can fit
- Inconsistent sizing between tabs

---

## Proposed Solution

### Approach: Grid Layout for Mobile Symmetry

Replace the flex horizontal scroll with a **2x2 grid on mobile** that fits all tabs on screen with perfect symmetry, then switch to **flex row on larger screens**.

### File: `src/pages/GlobalMapHub.tsx`

**Change 1:** Update container layout (lines 249-251)

```text
Current:
├── overflow-x-auto scrollbar-hide
├── flex items-center justify-start md:justify-center
├── gap-1.5 sm:gap-2 md:gap-3
└── min-w-max (forces horizontal scroll)

Proposed:
├── grid grid-cols-2 sm:flex
├── gap-2 sm:gap-2 md:gap-3
├── justify-items-center (grid) / justify-center (flex)
└── Remove min-w-max (no scroll needed)
```

**Change 2:** Update button sizing for consistent width (lines 262-271)

```text
Current button classes:
├── px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5
└── flex-shrink-0

Proposed button classes:
├── px-3 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5
├── w-full sm:w-auto (full width in grid cell)
├── justify-center (center content)
└── Remove flex-shrink-0 (not needed with grid)
```

**Change 3:** Simplify mobile abbreviations (lines 276-281)

Keep abbreviated names but ensure consistent display:
- 🇿🇦 SA (South Africa)
- 🇵🇹 PT (Portugal)  
- 🇹🇭 TH (Thailand)
- 🇬🇧 UK (United Kingdom)

---

## Code Implementation

### Updated Container Structure

```tsx
{/* Region Pills - 2x2 Grid on mobile, centered flex on larger screens */}
<div className="px-2 sm:px-0">
  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-items-center sm:justify-center gap-2 md:gap-3 mb-3 md:mb-4">
    {Object.entries(countryDisplayInfo).map(([key, info]) => {
      const isSelected = selectedCountry === key;
      const status = statusConfig[info.status];
      
      return (
        <motion.button
          key={key}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleCountrySelect(key)}
          className={`
            relative w-full sm:w-auto px-3 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 
            rounded-xl text-xs sm:text-sm font-medium transition-all duration-300
            flex items-center justify-center gap-1.5 sm:gap-2
            ${isSelected 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/50' 
              : isDark 
                ? 'bg-white/[0.08] text-white/80 hover:bg-white/[0.12] hover:text-white border border-white/10'
                : 'bg-black/[0.06] text-foreground/80 hover:bg-black/[0.10] hover:text-foreground border border-black/10'
            }
          `}
        >
          <span className="text-sm sm:text-base">{info.flag}</span>
          <span className="hidden sm:inline">{info.name}</span>
          <span className="sm:hidden text-[11px] font-medium">
            {key === 'southAfrica' ? 'South Africa' : 
             key === 'portugal' ? 'Portugal' : 
             key === 'thailand' ? 'Thailand' : 
             key === 'uk' ? 'UK' : info.name}
          </span>
          
          {info.status === 'LIVE' && (
            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500" />
            </span>
          )}
          {info.status !== 'LIVE' && (
            <span className={`hidden sm:inline text-[10px] uppercase tracking-wider ${status.textColor} opacity-80`}>
              {status.label}
            </span>
          )}
        </motion.button>
      );
    })}
  </div>
</div>
```

---

## Visual Result

### Mobile View (2x2 Grid):
```text
┌─────────────────────────────────────┐
│  ┌───────────────┐ ┌───────────────┐│
│  │🇿🇦 South Africa│ │🇵🇹 Portugal   ││
│  └───────────────┘ └───────────────┘│
│  ┌───────────────┐ ┌───────────────┐│
│  │🇹🇭 Thailand    │ │🇬🇧 UK          ││
│  └───────────────┘ └───────────────┘│
│         Powered by Dr. Green         │
└─────────────────────────────────────┘
```

### Desktop View (Flex Row - unchanged):
```text
┌────────────────────────────────────────────────────────────────────┐
│ 🇿🇦 South Africa • │ 🇵🇹 Portugal HQ │ 🇹🇭 Thailand PROD │ 🇬🇧 UK SOON │
└────────────────────────────────────────────────────────────────────┘
```

---

## Regional Navigation Confirmation

Verified the current navigation logic is correct:

| Region | Click Behavior | Status |
|--------|----------------|--------|
| 🇿🇦 South Africa | → External site (healingbuds.co.za) | ✅ Correct |
| 🇵🇹 Portugal (HQ) | → Global site (/home) | ✅ Correct |
| 🇹🇭 Thailand | → Registration form | ✅ Correct |
| 🇬🇧 United Kingdom | → Registration form | ✅ Correct |

**No changes needed to RegionSlidePanel.tsx** - the UK and PT regions already show registration forms since they're not live.

---

## Summary of Changes

| File | Change | Purpose |
|------|--------|---------|
| `GlobalMapHub.tsx` | Replace horizontal scroll with 2x2 grid on mobile | Perfect symmetry on mobile |
| `GlobalMapHub.tsx` | Update button classes for full-width in grid | Equal-sized buttons |
| `GlobalMapHub.tsx` | Show full country names on mobile (not just abbreviations) | Better readability with grid space |
| `GlobalMapHub.tsx` | Remove scrollbar-hide utility usage | No longer needed |

---

## Benefits

1. **Symmetry**: 2x2 grid ensures perfect visual balance
2. **No scrolling**: All 4 countries visible without horizontal scroll
3. **Touch-friendly**: Larger tap targets with full-width buttons
4. **Readable**: Full country names instead of abbreviations (space allows it)
5. **Responsive**: Seamlessly transitions to flex row on larger screens
6. **Consistent**: Same visual weight for all 4 regions

