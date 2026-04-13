---
name: scrollytelling-sticky-animations
description: Build cinematic, scroll-driven landing pages and marketing sites with sticky pinned sections, scroll-triggered reveal animations (fade-in, slide-up, zoom-in, stagger), smooth scrolling via Lenis, and premium scroll-synced timelines via GSAP ScrollTrigger — all optimized for Next.js App Router.
---

# Scrollytelling + Sticky Scroll-Triggered Animations

## What Is Scrollytelling?

Scrollytelling is a web design pattern where the page tells a **narrative story as the user scrolls**, creating a **PowerPoint-like animation experience** in the browser. The scroll position drives everything: reveals, transitions, sticky pins, and content transformations.

**Key Characteristics**:
- Elements reveal themselves (fade-in, slide-up, zoom-in) as they enter the viewport
- Sticky sections **pin in place** while content transforms within them
- Staggered reveals — children appear one by one like PowerPoint bullet points
- Buttery smooth scrolling creates a premium, high-end feel
- Each scroll "frame" delivers one digestible piece of information

---

## How Scroll-Triggered Reveal Animations Work

This is the "secret" to creating PowerPoint-like animations on scroll:

```
Step 1: Element starts HIDDEN
  → opacity: 0, offset position (translateY: 60px)

Step 2: DETECTION
  → Intersection Observer API (or GSAP ScrollTrigger)
  → Detects element entering the viewport

Step 3: ANIMATION fires
  → fade-in, slide-up, zoom-in, stagger
  → Elements appear one by one, creating cinematic pacing
```

---

## Animation Library Decision Matrix

| Library | Best For | Size | Difficulty | Next.js |
|---------|----------|------|------------|---------|
| **GSAP + ScrollTrigger** | Complex timelines, sticky pins, scrub-to-scroll | ~30KB | Medium | ✅ `'use client'` + `useEffect` |
| **Framer Motion** | Declarative reveals, `whileInView`, page transitions | ~30KB | Easy | ✅ Native React |
| **Lenis** | Buttery smooth scrolling (industry standard 2026) | ~3KB | Easy | ✅ via hook |
| **AOS** | Simple reveals — just add `data-aos="fade-up"` | ~14KB | Very Easy | ✅ `'use client'` |
| **Intersection Observer** | Zero-dependency viewport detection | 0KB | Medium | ✅ Native API |
| **CSS `@scroll-timeline`** | Pure CSS scroll-driven (emerging standard) | 0KB | Easy | ⚠️ Limited support |

### Recommended Stacks

**Full Power** (complex marketing sites):
```
Lenis (smooth scroll) + GSAP ScrollTrigger (sticky/scrub/timeline) + CSS reveals
```

**Balanced** (most use cases):
```
Lenis (smooth scroll) + Framer Motion (whileInView reveals + stagger)
```

**Lightweight** (simple landing pages):
```
Lenis (smooth scroll) + Intersection Observer + Tailwind CSS transitions
```

**Quick & Dirty** (prototyping):
```
AOS (data-aos attributes) — install, init, done
```

---

## Installation

### Full Stack

```bash
npm install gsap lenis framer-motion
```

### Lightweight

```bash
npm install lenis
# OR for quick prototyping:
npm install aos
```

---

## Core Pattern 1: Smooth Scrolling (Lenis)

Lenis creates "buttery smooth" scrolling (~3KB). **Always install this first** — it's the foundation that makes everything else feel premium.

```tsx
// hooks/useSmoothScroll.ts
'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,          // 0.05 = silk smooth, 0.1 = balanced, 0.15 = snappy
      smoothWheel: true,
      autoResize: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
}
```

### Usage in Next.js Layout

```tsx
// app/landing/layout.tsx
'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}
```

---

## Core Pattern 2: Lenis + GSAP ScrollTrigger Sync

When combining Lenis with GSAP, you **MUST** synchronize them to prevent jitter:

```tsx
// hooks/useSmoothScrollGSAP.ts
'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScrollGSAP() {
  useEffect(() => {
    const lenis = new Lenis();

    // Sync: tell ScrollTrigger every time Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for Lenis RAF (keeps them perfectly in sync)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0); // CRITICAL: prevents jitter

    return () => {
      lenis.destroy();
      gsap.ticker.remove(() => {});
    };
  }, []);
}
```

---

## Core Pattern 3: Scroll-Triggered Reveal (Framer Motion)

The easiest way to make elements animate in as they appear in viewport — **zero configuration**, **declarative**, **React-native**:

```tsx
// components/landing/ScrollReveal.tsx
'use client';

import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

const offsets = {
  up:    { y: 60 },
  down:  { y: -60 },
  left:  { x: 60 },
  right: { x: -60 },
  none:  {},
};

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  );
}
```

### Usage

```tsx
<ScrollReveal>
  <h2 className="text-4xl font-bold">Features</h2>
</ScrollReveal>

<ScrollReveal direction="left" delay={0.2}>
  <p className="text-lg text-muted-foreground">Description text</p>
</ScrollReveal>

<ScrollReveal direction="right" delay={0.4}>
  <img src="/feature.png" alt="Feature" className="rounded-2xl shadow-xl" />
</ScrollReveal>
```

---

## Core Pattern 4: Stagger Reveal (Children Appear One by One)

Like PowerPoint bullet points appearing sequentially:

```tsx
// components/landing/StaggerReveal.tsx
'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

interface StaggerRevealProps {
  children: React.ReactNode[];
  className?: string;
}

export function StaggerReveal({ children, className }: StaggerRevealProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Usage

```tsx
<StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {features.map(f => <FeatureCard key={f.id} {...f} />)}
</StaggerReveal>
```

---

## Core Pattern 5: Sticky Pinned Section (GSAP ScrollTrigger)

The **signature scrollytelling effect** — a section pins in place while content animates within it. This creates the "scroll through a slideshow" feel:

```tsx
// components/landing/StickyShowcase.tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { title: 'Step 1: Connect',  desc: 'Link your data sources in one click.',  image: '/step1.png' },
  { title: 'Step 2: Analyze',  desc: 'AI-powered insights in seconds.',       image: '/step2.png' },
  { title: 'Step 3: Ship',     desc: 'Deploy to production with confidence.', image: '/step3.png' },
];

export function StickyShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=3000',       // Pixels of scroll the pin lasts
          scrub: 1,            // Smooth link to scroll position
          pin: true,           // PIN the section in place
          anticipatePin: 1,    // Prevents flash on pin start
        },
      });

      // Animate steps sequentially
      tl.from('.step-0', { opacity: 0, y: 60, duration: 1 })
        .from('.step-1', { opacity: 0, y: 60, duration: 1 })
        .from('.step-2', { opacity: 0, y: 60, duration: 1 });
    }, containerRef);

    return () => ctx.revert(); // CLEANUP: prevents memory leaks
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">
        {steps.map((step, i) => (
          <div key={i} className={`step-${i} absolute inset-0 flex items-center justify-center`}>
            <div className="text-center max-w-2xl">
              <h3 className="text-4xl font-bold mb-4">{step.title}</h3>
              <p className="text-xl text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Variant: Split Layout (Text scrolls, Image sticks)

```tsx
export function SplitStickyShowcase() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Scrolling text steps */}
          <div className="space-y-[50vh]">
            {steps.map((step, i) => (
              <ScrollReveal key={i}>
                <div className="py-24">
                  <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Right: Sticky image */}
          <div className="hidden lg:block">
            <div className="sticky top-1/4">
              <img src="/showcase.png" alt="" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## Core Pattern 6: Zero-Dependency Reveal (Intersection Observer + CSS)

No libraries needed — pure React + Tailwind transitions. Perfect for lightweight pages:

```tsx
// hooks/useIsVisible.ts
'use client';

import { useEffect, useRef, useState } from 'react';

export function useIsVisible(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Once visible, stop observing
        }
      },
      { threshold: 0.15, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
```

```tsx
// components/landing/FadeInSection.tsx
'use client';

import { useIsVisible } from '@/hooks/useIsVisible';
import { cn } from '@/lib/utils';

export function FadeInSection({
  children,
  className,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const { ref, isVisible } = useIsVisible();

  const translateMap = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translateMap[direction]}`,
        className
      )}
    >
      {children}
    </div>
  );
}
```

---

## Core Pattern 7: AOS (Animate On Scroll) — Fastest Setup

Just install, init, and add data attributes. Best for prototyping:

```tsx
// app/landing/layout.tsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  return <>{children}</>;
}
```

### Usage — Zero Code, Just Attributes

```tsx
<div data-aos="fade-up">Fades up on scroll</div>
<div data-aos="fade-left" data-aos-delay="200">Fades from left, 200ms delay</div>
<div data-aos="zoom-in" data-aos-duration="1000">Zooms in over 1 second</div>
<div data-aos="flip-up">Flips up</div>
```

### AOS Available Animations

| Fade | Slide | Zoom | Flip |
|------|-------|------|------|
| `fade-up` | `slide-up` | `zoom-in` | `flip-up` |
| `fade-down` | `slide-down` | `zoom-in-up` | `flip-down` |
| `fade-left` | `slide-left` | `zoom-in-down` | `flip-left` |
| `fade-right` | `slide-right` | `zoom-in-left` | `flip-right` |
| `fade-up-right` | | `zoom-in-right` | |
| `fade-up-left` | | `zoom-out` | |

---

## Landing Page Section Architecture

### Conversion-Optimized Section Order

```
┌─────────────────────────────────────┐
│  1. NAVBAR          ← sticky, glassmorphism, transparent
├─────────────────────────────────────┤
│  2. HERO            ← headline + CTA + visual (above the fold)
├─────────────────────────────────────┤
│  3. SOCIAL PROOF    ← logo strip: "Trusted by X, Y, Z"
├─────────────────────────────────────┤
│  4. FEATURES        ← 3-4 cards with stagger reveal
├─────────────────────────────────────┤
│  5. HOW IT WORKS    ← 3-step numbered process
├─────────────────────────────────────┤
│  6. STICKY SHOWCASE ← ⭐ The scrollytelling star section (pinned)
├─────────────────────────────────────┤
│  7. TESTIMONIALS    ← customer quotes, photos, ratings
├─────────────────────────────────────┤
│  8. PRICING         ← clear tiers, highlighted plan
├─────────────────────────────────────┤
│  9. FAQ             ← accordion, objection-handling
├─────────────────────────────────────┤
│  10. FINAL CTA      ← last push: headline + button + guarantee
├─────────────────────────────────────┤
│  11. FOOTER         ← links, legal, social icons
└─────────────────────────────────────┘
```

### File Structure

```
app/
├── (landing)/               # Route group for landing pages
│   ├── layout.tsx           # Lenis smooth scroll + no sidebar
│   └── page.tsx             # Landing page composed of sections
│
components/landing/
├── Navbar.tsx
├── Hero.tsx
├── SocialProofBar.tsx
├── Features.tsx
├── HowItWorks.tsx
├── StickyShowcase.tsx       # ⭐ The scrollytelling star
├── Testimonials.tsx
├── Pricing.tsx
├── FAQ.tsx
├── FinalCTA.tsx
├── Footer.tsx
├── ScrollReveal.tsx         # Reusable reveal wrapper
└── StaggerReveal.tsx        # Reusable stagger wrapper
```

---

## Hero Section Patterns

### Variant A: Centered Hero (Dark Gradient)

```tsx
<section className="relative min-h-screen flex items-center justify-center
  bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 overflow-hidden">

  {/* Radial glow background */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
    from-blue-900/20 via-transparent to-transparent" />

  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
    {/* Badge */}
    <div className="inline-flex items-center px-4 py-1.5 rounded-full
      bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
      ✨ Now available
    </div>

    {/* Headline */}
    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
      Build something
      <span className="bg-gradient-to-r from-blue-400 to-cyan-400
        bg-clip-text text-transparent"> amazing</span>
    </h1>

    {/* Subheadline */}
    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
      The modern platform for teams who ship faster.
    </p>

    {/* CTAs */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500
        text-white font-semibold rounded-xl transition-all shadow-lg
        shadow-blue-500/25 hover:shadow-blue-500/40">
        Get Started Free
      </a>
      <a href="#" className="px-8 py-3.5 border border-slate-600
        text-slate-300 hover:text-white hover:border-slate-400
        font-medium rounded-xl transition-all">
        Watch Demo →
      </a>
    </div>
  </div>
</section>
```

### Variant B: Split Hero (Text + Visual)

```tsx
<section className="min-h-screen flex items-center py-20">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    <div>
      <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
        Manage your finances <span className="text-primary">effortlessly</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Track expenses, manage debts, and build wealth — all in one place.
      </p>
      <div className="flex gap-4">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </div>
    </div>
    <div className="relative">
      <img src="/dashboard-preview.png" alt="Dashboard" className="rounded-2xl shadow-2xl" />
    </div>
  </div>
</section>
```

---

## Glassmorphism Navbar

```tsx
<nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70
  border-b border-slate-200/50 dark:border-slate-800/50">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <Logo />
    <div className="hidden md:flex items-center gap-8">
      <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
      <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
      <Button>Get Started</Button>
    </div>
  </div>
</nav>
```

---

## 2026 Design Trends

### 1. Cinematic Pacing
- Each scroll "frame" = **one message only**
- Generous whitespace: `py-24` or `py-32` between sections
- Don't rush — let animations breathe

### 2. Dark Hero, Light Content
- Dark gradient hero (`slate-950` → `slate-900`)
- Light content sections for readability
- Gradient transitions between dark ↔ light

### 3. Kinetic Typography
- Headlines with gradient text: `bg-gradient-to-r bg-clip-text text-transparent`
- Text that grows/shrinks/slides on scroll
- Variable font weight animation

### 4. Bento Grid Layouts
- Asymmetric grids for feature sections
- Mixed card sizes (1×1, 2×1, 1×2)
- Large border radius (`rounded-2xl`, `rounded-3xl`)

### 5. Radial Gradient Backgrounds
```tsx
<div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
  from-blue-900/20 via-slate-950 to-slate-950" />
```

### 6. Micro-interactions
- Buttons with `active:scale-95` feedback
- Cards with `hover:shadow-xl hover:-translate-y-1`
- Cursor-following gradient highlights

---

## Performance Rules

### Animation Performance
- ✅ Animate `transform` and `opacity` only (GPU-composited)
- ❌ **NEVER** animate `width`, `height`, `top`, `left`, `margin`, `padding` → layout reflow
- ✅ Use `will-change: transform` on elements about to animate
- ✅ Set `viewport={{ once: true }}` — don't re-trigger reveals

### GSAP Cleanup in React/Next.js

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP animations scoped here
  }, containerRef);   // Scope to container

  return () => ctx.revert();  // ALWAYS cleanup
}, []);
```

### ScrollTrigger Best Practices
- Call `ScrollTrigger.refresh()` after dynamic content loads
- Use `ScrollTrigger.matchMedia()` for mobile-specific animations
- **Never** mix CSS `position: sticky` with GSAP `pin: true` on same element
- Set `gsap.ticker.lagSmoothing(0)` when using Lenis

### Page Load Performance
- Lazy-load images below the fold (`loading="lazy"`)
- Preload hero fonts and images
- Target < 3s First Contentful Paint
- Consider dynamic imports for GSAP: `const gsap = (await import('gsap')).gsap`

---

## Custom CSS Keyframes (Tailwind)

For simple reveals without JS libraries, add to `globals.css`:

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
}

.animate-fade-up     { animation: fade-up 0.7s ease-out forwards; }
.animate-fade-in     { animation: fade-in 0.7s ease-out forwards; }
.animate-scale-in    { animation: scale-in 0.6s ease-out forwards; }
.animate-slide-left  { animation: slide-in-left 0.7s ease-out forwards; }
```

---

## Complete Landing Page Skeleton (Next.js)

```tsx
// app/(landing)/page.tsx
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { StaggerReveal } from '@/components/landing/StaggerReveal';
import { StickyShowcase } from '@/components/landing/StickyShowcase';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <Hero />

      <ScrollReveal>
        <SocialProofBar />
      </ScrollReveal>

      <ScrollReveal>
        <Features />
      </ScrollReveal>

      <ScrollReveal>
        <HowItWorks />
      </ScrollReveal>

      <StickyShowcase />   {/* Self-managed scroll animations */}

      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal>
        <Pricing />
      </ScrollReveal>

      <ScrollReveal>
        <FAQ />
      </ScrollReveal>

      <ScrollReveal>
        <FinalCTA />
      </ScrollReveal>

      <Footer />
    </div>
  );
}
```

```tsx
// app/(landing)/layout.tsx
'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}
```

---

## CTA Patterns

### High-Converting Button

```tsx
<button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500
  text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25
  hover:shadow-blue-500/40 transition-all duration-200 active:scale-95">
  Get Started Free
</button>
```

### Trust Microcopy (Always Add Below CTAs)

```
✓ No credit card required
✓ Free 14-day trial
✓ Cancel anytime
✓ Setup in under 2 minutes
```

### Effective CTA Texts

| ✅ High-converting | ❌ Weak |
|--------------------|---------|
| "Get Started Free" | "Submit" |
| "Start Your Free Trial" | "Click Here" |
| "See It In Action" | "Learn More" |
| "Join 10,000+ Teams" | "Sign Up" |

---

## Rules

- ✅ Always use `'use client'` for animation components
- ✅ Always cleanup GSAP with `ctx.revert()` in useEffect return
- ✅ Use `viewport={{ once: true }}` — don't re-trigger reveals
- ✅ Animate `transform` + `opacity` only (GPU-composited)
- ✅ Install Lenis first for buttery smooth base scrolling
- ✅ Use generous whitespace (`py-24`, `py-32`) for cinematic pacing
- ❌ Never animate `width`, `height`, `margin`, `padding`
- ❌ Never mix CSS `position: sticky` with GSAP `pin: true`
- ❌ Never skip GSAP cleanup — causes memory leaks in React
- ❌ Never put scroll animation in server components
