---
name: Academic Log System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#005a82'
  on-tertiary: '#ffffff'
  tertiary-container: '#0074a6'
  on-tertiary-container: '#e4f2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 1.5rem
  margin-page: 2rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The brand personality for this design system is **Intellectual, Visionary, and Methodical**. It targets high-achieving students and academic administrators who require a frictionless, high-performance environment to track productivity. 

The aesthetic is a sophisticated fusion of **Minimalist SaaS** utility and **Glassmorphism** depth. It borrows the structural clarity of Notion, the robust information density of AdminLTE, and the premium finish of modern fintech dashboards. The emotional response should be one of "effortless organization"—a digital workspace that feels as focused as a quiet university library but as fast as a cutting-edge laboratory.

## Colors

The palette is anchored by **Academic Blue (#2563eb)**, representing stability and institutional trust. This is accented by **Ethereal Purple (#7c3aed)**, primarily used in subtle linear gradients to denote progression and "future-forward" thinking.

### Color Strategy
- **Primary:** Used for main actions and brand identity.
- **Surface:** Both Light and Dark modes utilize semi-transparent layers for a glass effect.
- **Semantic Accents:**
  - `Success`: Emerald-500 for "Selesai".
  - `Warning`: Amber-500 for "Diproses".
  - `Neutral`: Slate-400 for "Pending".
- **Gradients:** Use a 135-degree linear gradient from Primary Blue to Ethereal Purple for high-impact areas like progress bars or active state highlights.

## Typography

This design system utilizes **Inter** exclusively to maintain a systematic, utilitarian aesthetic that remains highly legible in data-heavy contexts.

### Hierarchy Rules
- **Numerical Data:** Use a slightly tighter letter-spacing for large metrics to mirror high-end financial dashboards.
- **Contextual Labels:** Small labels (e.g., table headers) should always use the `label-sm` style with increased letter spacing to differentiate from body content.
- **Readability:** Maintain a maximum line width of 700px for long-form activity descriptions to ensure academic focus.

## Layout & Spacing

This design system employs a **12-column Fluid Grid** for the main content area, with a fixed sidebar (280px) for navigation.

### Structural Logic
- **Margins:** Page-level padding scales from `1rem` on mobile to `2rem` on desktop.
- **Density:** Elements are spaced using an 8px (0.5rem) base unit. Academic lists (logs) should favor "Comfortable" density to reduce cognitive load.
- **Breakpoints:**
  - `Mobile`: < 768px (Sidebar collapses to a bottom navigation bar or hamburger menu).
  - `Tablet`: 768px - 1024px (2-column layout for dashboard widgets).
  - `Desktop`: > 1024px (Full 3-column or multi-widget layout).

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Tinted Ambient Shadows**.

- **Level 0 (Background):** Solid color (Slate-50 in light, Slate-950 in dark).
- **Level 1 (Cards):** 70% opacity surface with a `20px` backdrop blur and a `1px` subtle border (white at 20% opacity).
- **Level 2 (Dropdowns/Modals):** Increased blur (`40px`) and a deep, diffused shadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`.
- **Transitions:** All elevation changes (e.g., hovering over a log entry) must use a `200ms ease-out` transition, slightly lifting the card using a negative Y-transform (`-4px`).

## Shapes

The design system uses a **Rounded** shape language to soften the institutional feel of the academic app.

- **Inputs & Buttons:** `0.5rem` (rounded-md) for standard fields.
- **Dashboard Cards:** `1.5rem` (rounded-xl) to emphasize the "glass container" aesthetic.
- **Status Badges:** Fully pill-shaped (rounded-full) to distinguish them from interactive buttons.
- **Decorative Elements:** Subtle circular gradients in the background should be large and blurred to avoid distracting from content.

## Components

### Buttons
Primary buttons use the Blue-to-Purple gradient with a subtle inner glow. Hover states should increase the gradient intensity. Ghost buttons are preferred for secondary actions like "Cancel" or "View Archive."

### Status Badges (Elegant)
- **Selesai:** Emerald-50 background (10% opacity) with Emerald-600 text and a small leading dot.
- **Diproses:** Amber-50 background (10% opacity) with Amber-600 text.
- **Pending:** Slate-100 background (10% opacity) with Slate-500 text.

### Rounded Inputs
Form fields should have a `1px` border that glows with the Primary Blue color when focused. Use an inset shadow on dark mode to give the input fields a "sunken" feel relative to the glass cards.

### Activity Cards (Notion-style)
Each activity log entry is a card with a clear title, a timestamp in `label-sm`, and an optional tag list. Include a "quick action" hover menu (edit, delete, share) that appears in the top right corner.

### Smooth Animations
Implement a "staggered fade-in" for dashboard widgets upon page load. Use a spring physics animation (`stiffness: 100, damping: 15`) for opening activity details to give the interface a tactile, high-end feel.