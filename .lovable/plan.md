

# Increase Dr. Green Logo Size on Global Healthcare Network Page

## Current State
The Dr. Green logo at the bottom of the GlobalMapHub page currently uses `h-5` (20px height), which makes it appear quite small and hard to read.

## Proposed Change

**File:** `src/pages/GlobalMapHub.tsx` (lines 286-293)

Update the "Powered by Dr. Green" section to increase logo visibility:

```text
Current:
├── Text: text-xs (12px)
├── Logo: h-5 (20px height)
└── Gap: gap-2 (8px)

Proposed:
├── Text: text-xs sm:text-sm (12px → 14px on larger screens)
├── Logo: h-7 sm:h-8 (28px → 32px height, responsive)
└── Gap: gap-2 sm:gap-3 (8px → 12px on larger screens)
└── Opacity: Increased from 50%/60% to 70%/80% for better visibility
```

### Code Change

Update lines 286-293:

```tsx
{/* Powered by Dr. Green */}
<div className="flex items-center justify-center gap-2 sm:gap-3">
  <span className={`${isDark ? 'text-white/40' : 'text-foreground/50'} text-xs sm:text-sm`}>Powered by</span>
  <img 
    src={drGreenLogo} 
    alt="Dr. Green" 
    className={`h-7 sm:h-8 w-auto object-contain ${isDark ? 'opacity-70' : 'opacity-80 brightness-0'}`}
  />
</div>
```

## Summary of Changes

| Property | Before | After |
|----------|--------|-------|
| Logo height | `h-5` (20px) | `h-7 sm:h-8` (28-32px) |
| Text size | `text-xs` | `text-xs sm:text-sm` |
| Gap | `gap-2` | `gap-2 sm:gap-3` |
| Dark opacity | `opacity-50` | `opacity-70` |
| Light opacity | `opacity-60` | `opacity-80` |

This will make the Dr. Green logo approximately 40-60% larger and more visible while maintaining responsive scaling for mobile devices.

