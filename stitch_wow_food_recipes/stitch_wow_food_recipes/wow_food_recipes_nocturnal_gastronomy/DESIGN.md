---
name: Annapurna Nocturnal Gastronomy
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#dbc2ad'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
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
  secondary-container: '#00fe66'
  on-secondary-container: '#007128'
  tertiary: '#ffbcb5'
  on-tertiary: '#690006'
  tertiary-container: '#ff9389'
  on-tertiary-container: '#8d000c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbd'
  primary-fixed-dim: '#ffb86f'
  on-primary-fixed: '#2c1600'
  on-primary-fixed-variant: '#693c00'
  secondary-fixed: '#6bff83'
  secondary-fixed-dim: '#00e55b'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531b'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ac'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000d'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
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
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style
This design system centers on a "Rich Culinary Dark Mode" aesthetic, blending the precision of high-end kitchen tech with the vibrant energy of street food culture. The personality is premium yet high-energy, utilizing an absolute black foundation to make food photography and neon accents pop with cinematic intensity.

The design style is a hybrid of **Glassmorphism** and **Minimalism**. UI elements are treated as translucent layers floating over deep space, utilizing heavy backdrop blurs to maintain legibility while preserving the "bottomless" feel of the pure black background.

**Brand Identity:**
- The "annapurna" wordmark is typeset in a lowercase serif. 
- "anna" is rendered in Electric Mango (#FF9900).
- "purna" is rendered in Off-White (#F5F5F5).
- The visual narrative should evoke a sense of late-night luxury and culinary mastery.

## Colors
The palette is rooted in an **Absolute Black (#000000)** canvas to maximize contrast and eliminate light bleed on OLED displays.

- **Electric Mango (#FF9900):** The primary brand engine, used for CTAs, highlights, and active states.
- **Emerald Green (#00FF66):** Reserved exclusively for vegetarian iconography and status indicators.
- **Crimson Red (#FF3333):** Reserved for non-vegetarian indicators and error states.
- **Glass Surfaces:** Fills use a deep charcoal at 60% opacity to provide a "smoked glass" effect that separates content from the pure black void.

## Typography
The system employs a dual-typeface strategy to balance heritage with modern utility.

- **EB Garamond (Heritage Serif):** Used for headlines and branding to evoke the "Heritage Kitchen" feel. It should be typeset with slightly tighter tracking in large sizes for a sophisticated, editorial appearance.
- **Hanken Grotesk (Modern Sans):** Used for all functional UI elements, labels, and body text. It provides high legibility against dark backgrounds and maintains a clean, technical edge.
- **Weight Usage:** Use Medium (500) or SemiBold (600) for UI labels to ensure they don't get lost against the black background.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous internal safe areas to allow the glass panels room to breathe.

- **Mobile:** 4-column grid with 24px side margins.
- **Desktop/Tablet:** 12-column grid with a maximum content width of 1280px.
- **Rhythm:** Use an 8px base unit. Component internal padding should favor the 12px and 16px steps to ensure the "Glass" panels feel substantial and premium.
- **Negative Space:** Embrace wide margins around food imagery to create a gallery-like experience.

## Elevation & Depth
Depth is created through optical layering rather than traditional shadows. 

1.  **Level 0 (Base):** Absolute Black (#000000).
2.  **Level 1 (Panels):** Semi-transparent dark fill (60% opacity) with a **16px Backdrop Blur**. Every panel must have a **1px solid border** at 10% white to define its edges against the black background.
3.  **Level 2 (Modals/Popovers):** Slightly lighter fill (80% opacity) with a 32px backdrop blur and a subtle 1px border at 20% white.

Avoid drop shadows. The separation is achieved purely through the contrast of the frosted glass blur and the crispness of the hairline borders.

## Shapes
The shape language is "Rounded-Soft." Standard cards and containers use a 16px (1rem) corner radius. 

Smaller elements like input fields and buttons follow the same 8px (0.5rem) logic. This moderate rounding complements the elegant serif typography while maintaining the structured feel of a modern SaaS application.

## Components
- **Buttons:** Primary buttons use a solid Electric Mango (#FF9900) fill with black text. Secondary buttons use the frosted glass treatment with an Electric Mango border and text.
- **Food Badges (Dietary):** Small, circular indicators. Emerald Green for Veg, Crimson Red for Non-Veg. These should include a subtle outer glow of the same color to simulate a neon effect.
- **Cards:** Must feature the 16px backdrop blur. Images within cards should have a slight vignette to blend seamlessly into the frosted surface.
- **Inputs:** Darker translucent fills (40% opacity) with a 1px border that illuminates to Electric Mango on focus.
- **Selection Controls:** Checkboxes and radio buttons use Electric Mango for the active state.
- **Glass Chips:** Low-profile pills used for categories, featuring a 1px border and 12px backdrop blur.