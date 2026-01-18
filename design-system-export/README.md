# Healing Buds Design System

A complete design system package for building consistent Healing Buds branded applications.

## 📦 Contents

```
design-system-export/
├── README.md                    # This file
├── package-dependencies.json    # Required npm packages
├── src/
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn helper)
│   ├── styles/
│   │   ├── theme.css           # Core design tokens
│   │   ├── navigation.css      # Navigation component styles
│   │   └── index.css           # Main stylesheet with utilities
│   └── components/
│       └── ui/
│           └── button.tsx      # Button component with variants
└── tailwind.config.ts          # Tailwind configuration
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install framer-motion lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge tailwindcss-animate
```

### 2. Copy Files

Copy the contents of this export to your project:
- `src/lib/utils.ts` → Your project's `src/lib/utils.ts`
- `src/styles/*` → Your project's `src/styles/`
- `src/components/ui/button.tsx` → Your project's `src/components/ui/button.tsx`
- `tailwind.config.ts` → Your project root (merge with existing)

### 3. Import Styles

In your main CSS file (e.g., `index.css`):
```css
@import './styles/theme.css';
@import './styles/navigation.css';
```

### 4. Add Font

Add Plus Jakarta Sans to your `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## 🎨 Design Tokens

### Brand Colors (HSL)
| Token | Value | Hex |
|-------|-------|-----|
| `--primary-green` | `178 48% 21%` | `#1C4F4D` |
| `--secondary-green` | `178 48% 33%` | `#2C7D7A` |
| `--accent-green` | `164 48% 53%` | `#4DBFA1` |

### Application Colors
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--background` | `150 12% 97%` | `180 8% 7%` |
| `--foreground` | `172 32% 20%` | `150 8% 95%` |
| `--primary` | `175 42% 35%` | `168 38% 45%` |
| `--card` | `155 10% 99%` | `175 6% 11%` |

### Typography
- **Primary Font**: Plus Jakarta Sans
- **Heading Weight**: 600
- **Body Line Height**: 1.7

### Spacing Scale
```
xs: 0.5rem   sm: 0.75rem   md: 1rem
lg: 1.5rem   xl: 2rem      2xl: 3rem
```

### Border Radius
```
sm: calc(var(--radius) - 4px)
md: calc(var(--radius) - 2px)
lg: var(--radius)  /* 0.75rem */
xl: calc(var(--radius) + 4px)
2xl: calc(var(--radius) + 8px)
```

## 🧩 Components

### Button Variants
```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="glass">Glass</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

## 🎭 Utility Classes

### Hover Effects
```html
<div class="hover-lift">Lifts on hover</div>
<div class="hover-scale">Scales on hover</div>
```

### Cards
```html
<div class="card-linear">Linear-style card</div>
<div class="card-themed">Dark mode aware card</div>
```

### Section Backgrounds
```html
<section class="section-default">Default bg</section>
<section class="section-alt">Alternating bg</section>
<section class="section-sage">Sage tinted</section>
```

### Glass Buttons
```html
<button class="btn-glass">Glass button</button>
<button class="btn-glass-secondary">Secondary glass</button>
```

## 🌙 Dark Mode

Dark mode is enabled via the `dark` class on the root element:
```html
<html class="dark">
```

All design tokens automatically adapt. Use the `dark:` prefix in Tailwind for component-specific overrides.

## 📝 License

Healing Buds Design System © 2024
