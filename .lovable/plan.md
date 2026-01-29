

# Visual Enhancement: "Our Impact in Numbers" Section

## Overview

Transform the current statistics section from abstract number cards into a **visually-rich, story-driven experience** with photography, progress visualizations, and cinematic layout.

---

## Design Approach: "Cinematic Bento Grid with Photography"

Combine the Bento Grid layout with **embedded photography** from the existing asset library to create visual context for each metric.

---

## Visual Layout

```text
DESKTOP (Bento with Photography):
┌────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌───────────────────────────────────────┐  ┌───────────────────────┐  │
│  │  ╔═══════════════════════════════╗    │  │  🔬 50+ Partners      │  │
│  │  ║  [cultivation-facility.jpg]   ║    │  │  [research-lab.jpg]   │  │
│  │  ║   with dark overlay           ║    │  │  as subtle bg         │  │
│  │  ╚═══════════════════════════════╝    │  ├───────────────────────┤  │
│  │         🌿 18,000 m²                  │  │  🌍 15+ Countries     │  │
│  │     Cultivation Space                 │  │  [world map visual]   │  │
│  │   ▓▓▓▓▓▓▓▓▓▓▓░░░░░ 60k kg/yr         │  │                       │  │
│  └───────────────────────────────────────┘  └───────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ✅ 100% EU GMP Certified                                         │  │
│  │  [certification badges + animated checkmark + facility image]     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

MOBILE (Stacked with Photos):
┌─────────────────────────────┐
│  [cultivation-facility.jpg] │
│        18,000 m²            │
│    Cultivation Space        │
│    ▓▓▓▓▓▓▓░░░ Progress      │
└─────────────────────────────┘
┌────────────┐ ┌──────────────┐
│ 🔬 50+     │ │ 🌍 15+       │
│ Partners   │ │ Countries    │
│ [lab.jpg]  │ │ [map icon]   │
└────────────┘ └──────────────┘
┌─────────────────────────────┐
│  ✅ 100% EU GMP Certified   │
│  [badges visual]            │
└─────────────────────────────┘
```

---

## Asset Mapping

| Statistic | Background Image | Visual Element |
|-----------|------------------|----------------|
| Cultivation Space (Hero) | `cultivation-facility-bright.jpg` | Circular progress gauge |
| Research Partners | `research-lab-hq.jpg` | Partner logo silhouettes |
| Countries Served | None (use animated dots) | Stylized world map with pulse points |
| EU GMP Certified | `facility-safety-docs.jpg` | Animated checkmark + certificate badge |

---

## Implementation Details

### 1. Hero Stat Card with Photography

The "Cultivation Space" card gets a cinematic treatment:

```tsx
{/* Hero Card - Full background image */}
<div className="relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden">
  {/* Background Image with gradient overlay */}
  <div className="absolute inset-0">
    <img 
      src={cultivationImage}
      alt=""
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
  </div>
  
  {/* Content */}
  <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-full min-h-[320px] md:min-h-[400px]">
    <div className="mb-4">
      <span className="text-7xl md:text-8xl font-bold text-white">18,000</span>
      <span className="text-4xl font-bold text-primary">m²</span>
    </div>
    <p className="text-white/90 text-xl mb-6">Cultivation Space</p>
    
    {/* Progress Visualization */}
    <div className="mt-auto">
      <div className="flex justify-between text-sm text-white/60 mb-2">
        <span>Annual Production</span>
        <span>60,000 kg/year</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: '75%' }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </div>
  </div>
</div>
```

### 2. Secondary Cards with Subtle Photo Backgrounds

```tsx
{/* Research Partners Card */}
<div className="relative rounded-2xl overflow-hidden">
  <div className="absolute inset-0">
    <img src={researchLabImage} className="w-full h-full object-cover opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-br from-[#1C4F4D]/95 to-[#0D3D3A]/98" />
  </div>
  
  <div className="relative z-10 p-6">
    <Users className="w-8 h-8 text-primary mb-4" />
    <span className="text-4xl font-bold text-white">50+</span>
    <p className="text-white/70">Research Partners</p>
    <p className="text-sm text-white/50 mt-2">Imperial College, UPenn & more</p>
  </div>
</div>
```

### 3. Countries Card with Animated Map

```tsx
{/* Countries Card - Interactive Map Dots */}
<div className="relative rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6">
  {/* Simplified World Map SVG with pulsing dots */}
  <div className="absolute right-4 top-4 w-24 h-16 opacity-40">
    <svg viewBox="0 0 100 60" className="w-full h-full">
      {/* Simplified continent shapes */}
      <path d="M20,25 Q30,20 40,25..." fill="currentColor" className="text-white/30" />
      
      {/* Pulsing location dots */}
      {['UK', 'Portugal', 'Thailand', 'SA'].map((_, i) => (
        <circle 
          cx={[45, 35, 75, 50][i]} 
          cy={[22, 30, 35, 45][i]} 
          r="2" 
          fill="#4DBFA1"
          className="animate-pulse"
        />
      ))}
    </svg>
  </div>
  
  <Globe className="w-8 h-8 text-primary mb-4" />
  <span className="text-4xl font-bold text-white">15+</span>
  <p className="text-white/70">Countries Served</p>
</div>
```

### 4. Trust Banner with Certification Visual

```tsx
{/* EU GMP Banner - Full Width */}
<div className="md:col-span-3 relative rounded-2xl overflow-hidden">
  <div className="absolute inset-0">
    <img src={facilityDocsImage} className="w-full h-full object-cover opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#1C4F4D]/95 via-[#0D3D3A]/90 to-[#1C4F4D]/95" />
  </div>
  
  <div className="relative z-10 p-6 md:p-8 flex items-center justify-between flex-wrap gap-6">
    <div className="flex items-center gap-4">
      <motion.div 
        className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Award className="w-7 h-7 text-emerald-400" />
      </motion.div>
      <div>
        <span className="text-3xl font-bold text-white">100%</span>
        <p className="text-white/80">EU GMP Certified</p>
      </div>
    </div>
    
    {/* Trust Badges */}
    <div className="flex items-center gap-3 text-white/50 text-sm">
      <span className="flex items-center gap-1.5">
        <CheckCircle className="w-4 h-4 text-emerald-400" />
        Seed-to-Sale Traceability
      </span>
      <span className="hidden md:inline">•</span>
      <span className="flex items-center gap-1.5">
        <CheckCircle className="w-4 h-4 text-emerald-400" />
        Blockchain Verified
      </span>
    </div>
  </div>
</div>
```

---

## Animations

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero image | Ken Burns (slow zoom) | On section visible |
| Progress bar | Width 0→75% | Scroll into view |
| Map dots | Pulse with stagger | Continuous |
| Counter numbers | Spring physics count-up | Scroll into view |
| Cards | Fade up + scale | Staggered on scroll |

---

## Accessibility

- All images have `alt=""` (decorative)
- Progress bar has `aria-label` and `role="progressbar"`
- Sufficient contrast: white text on dark overlays
- Animations respect `prefers-reduced-motion`

---

## File Changes Summary

| File | Change |
|------|--------|
| `src/components/AnimatedStatistics.tsx` | Complete redesign with photography, bento grid, progress visualization |

---

## Before vs After

**Before:**
- 4 identical glass cards in a row
- Abstract gradient icons
- Floating particles (visual noise)
- No photography or real-world context

**After:**
- Asymmetric bento grid with visual hierarchy
- Hero card with cultivation facility photography
- Progress bar showing production capacity
- Countries card with animated map visualization
- Trust banner with certification badges
- Meaningful context beneath each number

---

## Technical Considerations

- **Performance**: Images lazy-loaded with `loading="lazy"`
- **Bundle Size**: Reuse existing images from `src/assets`
- **Responsive**: Mobile-first with elegant desktop expansion
- **Theme**: Works with current dark section styling

