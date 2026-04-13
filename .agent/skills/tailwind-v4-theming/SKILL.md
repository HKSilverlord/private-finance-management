---
name: tailwind-v4-theming
description: Tailwind CSS v4 with shadcn/ui theming — CSS-first configuration, OKLCH color system, custom variants, dark mode setup, and design system tokens for the finance app.
---

# Tailwind CSS v4 + shadcn Theming

## Overview

This project uses **Tailwind CSS v4** with:
- `@tailwindcss/postcss` plugin for Next.js
- shadcn/ui's OKLCH-based color system
- CSS-first configuration (no `tailwind.config.js`)
- `tw-animate-css` for animation utilities

---

## Setup

### PostCSS Config (`postcss.config.mjs`)

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### Entry CSS (`src/app/globals.css`)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... all semantic color mappings */
}
```

---

## Tailwind v4 Key Differences

| Feature | v3 | v4 |
|---------|----|----|
| Config | `tailwind.config.js` | CSS `@theme` block |
| Import | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| Content | `content: [...]` array | Auto-detection |
| Dark mode | `darkMode: 'class'` | `@custom-variant dark (...)` |
| Colors | RGB/HSL | OKLCH (perceptually uniform) |

---

## Color System (OKLCH)

### Why OKLCH?

OKLCH provides **perceptually uniform** colors — changing lightness doesn't shift hue, making it ideal for design tokens.

```css
/* Format: oklch(lightness chroma hue) */
--primary: oklch(0.205 0 0);         /* Near-black */
--destructive: oklch(0.577 0.245 27.325); /* Red */
```

### Light Theme (`:root`)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(1 0 0)` | Page background (white) |
| `--foreground` | `oklch(0.145 0 0)` | Main text (near-black) |
| `--card` | `oklch(1 0 0)` | Card backgrounds |
| `--primary` | `oklch(0.205 0 0)` | Primary buttons/accents |
| `--secondary` | `oklch(0.97 0 0)` | Secondary surfaces |
| `--muted` | `oklch(0.97 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | Secondary text |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Delete/error actions |
| `--border` | `oklch(0.922 0 0)` | Borders |

### Dark Theme (`.dark`)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.145 0 0)` | Page background |
| `--foreground` | `oklch(0.985 0 0)` | Main text |
| `--card` | `oklch(0.205 0 0)` | Card backgrounds |
| `--primary` | `oklch(0.922 0 0)` | Primary (inverted) |
| `--muted` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--border` | `oklch(1 0 0 / 10%)` | Borders (translucent) |
| `--sidebar-primary` | `oklch(0.488 0.243 264.376)` | Sidebar accent (blue) |

---

## Semantic Color Usage

### In Components

```tsx
// ✅ Use semantic tokens
<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground border-border" />
<div className="bg-muted text-muted-foreground" />
<div className="bg-primary text-primary-foreground" />
<div className="bg-destructive text-destructive-foreground" />

// ❌ Don't use hardcoded colors in themed components
<div className="bg-white text-black" />   // Breaks dark mode
<div className="bg-gray-100" />           // Not semantic
```

### For Charts & Custom Elements

When semantic tokens don't apply (e.g., chart colors), use chart tokens:

```css
--chart-1: oklch(0.87 0 0);
--chart-2: oklch(0.556 0 0);
--chart-3: oklch(0.439 0 0);
--chart-4: oklch(0.371 0 0);
--chart-5: oklch(0.269 0 0);
```

Or use explicit HSL for chart-specific colors in Recharts.

---

## Border Radius System

```css
--radius: 0.625rem;  /* Base radius (10px) */

/* Derived radii */
--radius-sm: calc(var(--radius) * 0.6);   /* 6px */
--radius-md: calc(var(--radius) * 0.8);   /* 8px */
--radius-lg: var(--radius);               /* 10px */
--radius-xl: calc(var(--radius) * 1.4);   /* 14px */
--radius-2xl: calc(var(--radius) * 1.8);  /* 18px */
```

---

## Dark Mode Toggle (Planned)

The app is **dark-mode-ready** with all CSS variables defined. Implementation:

```tsx
'use client';

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
```

---

## Adding Custom Theme Colors

To add new semantic colors:

1. Define in `globals.css`:
```css
:root {
  --success: oklch(0.6 0.2 145);
  --success-foreground: oklch(1 0 0);
}
.dark {
  --success: oklch(0.5 0.18 145);
  --success-foreground: oklch(0.98 0 0);
}
```

2. Map in `@theme inline`:
```css
@theme inline {
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
}
```

3. Use in components:
```tsx
<div className="bg-success text-success-foreground" />
```

---

## Rules

- ✅ Use OKLCH for all custom color definitions
- ✅ Use semantic tokens (`bg-background`, `text-foreground`) for themed elements
- ✅ Define both `:root` and `.dark` variants for any new color
- ✅ Use `@theme inline` to expose CSS variables to Tailwind
- ❌ Don't use `tailwind.config.js` (Tailwind v4 = CSS-first)
- ❌ Don't hardcode colors in components (`bg-white` → `bg-background`)
- ❌ Don't use `@tailwind` directives (v3 syntax)
