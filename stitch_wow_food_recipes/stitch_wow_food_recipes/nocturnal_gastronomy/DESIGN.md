---
name: Nocturnal Gastronomy
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#dbc2ad'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a38d7a'
  outline-variant: '#554434'
  surface-tint: '#ffb86f'
  primary: '#ffc082'
  on-primary: '#4a2800'
  primary-container: '#ff9900'
  on-primary-container: '#653a00'
  inverse-primary: '#8a5100'
  secondary: '#ebffe6'
  on-secondary: '#003911'
  secondary-container: '#02fe66'
  on-secondary-container: '#007129'
  tertiary: '#ffbdb4'
  on-tertiary: '#690003'
  tertiary-container: '#ff9486'
  on-tertiary-container: '#8e0005'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbd'
  primary-fixed-dim: '#ffb86f'
  on-primary-fixed: '#2c1600'
  on-primary-fixed-variant: '#693c00'
  secondary-fixed: '#6bff84'
  secondary-fixed-dim: '#00e55b'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930005'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  crimson-action: '#FF3B30'
  silver-secondary: '#9CA3AF'
  pure-white: '#FFFFFF'
  absolute-black: '#000000'
  smoked-glass-surface: rgba(31, 31, 31, 0.6)
  smoked-glass-overlay: rgba(42, 42, 42, 0.8)
  glass-hairline-light: rgba(255, 255, 255, 0.1)
  glass-hairline-bright: rgba(255, 255, 255, 0.2)
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  title-empty-state:
    fontFamily: Hanken Grotesk
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-empty-state:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  button-chip:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
This design system embodies a "Rich Culinary Dark Mode" aesthetic, fusing the disciplined precision of modern commercial kitchen technology with the electric soul of late-night street food culture. The tone is nocturnal, indulgent, and confident. The product evokes the atmospheric exclusivity of after-hours culinary exploration through absolute deep backgrounds, neon accent flares, and tactile smoky finishes.

The visual direction synthesizes **Glassmorphism** with austere **Minimalism**. Interface elements live as translucent frosted smoked-glass panels suspended over an OLED-optimized void. This approach guarantees stark typographic legibility while framing high-chroma culinary photography like museum artifacts in the dark.

**Identity Principles:**
- Wordmark typography balances an editorial heritage serif with precise technical grotesques.
- Color placement is purposeful: high-saturation accents cut strictly across dark smoked layers.
- The interface emphasizes atmospheric contrast, structural hairline framing, and focused clarity.

## Colors
The palette is built on an absolute dark canvas designed to deliver maximum dynamic range on OLED panels while preventing light pollution in low-light dining or kitchen environments.

- **Primary (Electric Mango - #FF9900):** The core brand driver used for primary user flows, key interactions, prominent badges, and active selections.
- **Secondary (Emerald Green - #00FE66):** Reserved strictly for vegetarian dietary taxonomy, success feedback, and freshness indicators.
- **Tertiary / Action Accent (Crimson Red - #FF3B30):** High-urgency brand red dedicated to destructive actions, critical empty state recovery CTAs, non-vegetarian dietary badges, and attention-critical alerts.
- **Silver Neutral (#9CA3AF):** High-contrast supportive neutral used for explanatory secondary copy and metadata across dark surfaces.
- **Smoked Glass Layers:** Background fills use variable dark opacities (60%–80%) to generate depth planes over the pure `#000000` ground without breaking the darkroom immersion.

## Typography
Typography is split purposefully between an artisanal heritage serif and a legible, high-performance grotesque.

- **EB Garamond:** Used for primary editorial headings, hero banners, and brand narratives. Large scale treatments feature tighter tracking to reinforce a bespoke culinary editorial style.
- **Hanken Grotesk:** Governs functional interface architecture, data structures, empty states, labels, buttons, and system messaging. Maintains clear separation and crisp character definition against dark smoky glass.
- **Empty State Typography Hierarchy:**
  - Header: `22sp Bold White #FFFFFF` (`title-empty-state`).
  - Descriptive Support: `14sp Regular Silver #9CA3AF` (`body-empty-state`).
- Keep UI labels and microcopy in Medium (500) to Bold (700) weights to prevent character degradation against dark background fields.

## Layout & Spacing
The layout system leverages a **Fluid Grid** with generous framing margins to prevent content crowding around floating panels.

- **Grid Architecture:**
  - **Desktop:** 12-column fluid layout with a maximum container bounding width of 1280px and 24px outer margins.
  - **Tablet:** 8-column layout with 24px margins.
  - **Mobile:** 4-column layout with 16px to 24px horizontal gutters.
- **Component Geometry:** An 8px spatial grid dictates overall flow, complemented by 4px micro-steps (`space-xs`, `space-sm`) for internal pill badges, chips, and tight specification cards.
- **Framing:** Maintain deep spatial voids between floating cards to let the pure black base act as structural negative space.

## Elevation & Depth
Elevation is achieved using physical optical layering, smoked translucency, and hairline boundaries instead of ambient drop shadows.

- **Base Void (Level 0):** Pure `#000000` base with zero light emission.
- **Smoked Panels (Level 1):** Background `rgba(31, 31, 31, 0.6)` with a `16px` backdrop filter blur and an enclosing `1px solid rgba(255, 255, 255, 0.1)` perimeter border.
- **Overlays and Cards (Level 2):** Background `rgba(42, 42, 42, 0.8)` with a `32px` backdrop blur and `1px solid rgba(255, 255, 255, 0.2)` edge reflection.
- **Specification Containers:** Dark tonal containers with hairline borders to visually separate specialized technical information while respecting the nocturnal palette.

## Shapes
The structural language is balanced and tactile, utilizing deliberate radius scaling across sizes.

- **Cards & Primary Panels:** Built with a consistent `1rem` (16px) corner radius.
- **Interactive Micro-Components:** Buttons, chips, and text entry fields standardize on `0.5rem` (8px) rounding to maintain structural cohesion.
- **Compact Chips & Pills:** Specialized status indicators or button chips utilize full pill rounding (`9999px`) or tight structural `0.5rem` radiuses depending on container context.

## Components

### UI Component Specification: Empty Data States
Production specification for zero-data views, search misses, and depleted dashboard states:

```
┌────────────────────────────────────────────────────────┐
│ UI COMPONENT SPECIFICATION: EMPTY DATA STATES          │
├────────────────────────────────────────────────────────┤
│ Container: Smoked Glass Level 1                        │
│ Border: 1px Solid rgba(255, 255, 255, 0.10)            │
│ Padding: 32px 24px                                     │
│ Alignment: Centered vertical stack (gap: 12px)         │
│                                                        │
│ Typography Tokens:                                     │
│ • Title: 22sp Bold White #FFFFFF                       │
│ • Description: 14sp Regular Silver #9CA3AF             │
│                                                        │
│ Action Component:                                      │
│ • Solid Crimson #FF3B30 Button Chip                    │
│   - Label: 'Reset Filter' / 'Add Item' (13sp Bold #FFF)│
│   - Corner Radius: 9999px (Pill)                       │
│   - Height: 36px | Padding: 0 18px                     │
│   - Hover State: Brightness 110% with 8px Crimson Glow │
└────────────────────────────────────────────────────────┘
```

- **Buttons:**
  - *Primary:* Solid Electric Mango (`#FF9900`) with absolute black text.
  - *Secondary:* Smoked translucent charcoal fill with hairline border and mango text.
  - *Crimson Chip:* Solid `#FF3B30` fill with crisp white text for immediate recovery actions.
- **Chips & Tags:** Frosted glass backing with `1px` border at 10% white; dietary indicators carry a soft monochromatic edge glow.
- **Cards:** Smoked glass containers with `16px` backdrop blur and `1px` white hairline framing.
- **Inputs & Fields:** Deep charcoal 40% fill, shifting to an Electric Mango border highlight on active focus.
- **Lists:** Borderless rows separated by `1px` hairline rules in `rgba(255, 255, 255, 0.06)`.