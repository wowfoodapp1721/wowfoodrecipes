---
name: Heritage Kitchen
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#534439'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#867468'
  outline-variant: '#d8c2b5'
  surface-tint: '#8e4e14'
  primary: '#8e4e14'
  on-primary: '#ffffff'
  primary-container: '#f4a261'
  on-primary-container: '#6f3800'
  inverse-primary: '#ffb780'
  secondary: '#436370'
  on-secondary: '#ffffff'
  secondary-container: '#c6e8f8'
  on-secondary-container: '#496977'
  tertiary: '#a7373b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff9896'
  on-tertiary-container: '#861f25'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc4'
  primary-fixed-dim: '#ffb780'
  on-primary-fixed: '#2f1400'
  on-primary-fixed-variant: '#6f3800'
  secondary-fixed: '#c6e8f8'
  secondary-fixed-dim: '#abcbdb'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#2b4b58'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#861f25'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  edge-margin: 20px
  gutter: 16px
---

## Brand & Style

The design system is centered on a "Modern Heritage" aesthetic. It balances the warmth of traditional home cooking with the precision of culinary expertise. The UI is designed to feel like a premium, well-curated digital cookbook—inviting, authentic, and deeply reliable.

The style leverages **Minimalism** to allow high-quality food photography to be the hero, combined with **Tactile** elements like soft shadows and organic curves to evoke a sense of comfort. Generous whitespace ensures that complex recipes feel approachable and easy to follow, reducing cognitive load for the user in a busy kitchen environment.

## Colors

The palette is inspired by natural ingredients and earth tones:
- **Primary (Saffron):** Used for primary actions, active states, and highlighting key culinary details. It evokes appetite and warmth.
- **Secondary (Forest Green):** Used for navigational elements and "Expert" badges. It provides a grounded, professional contrast to the vibrant saffron.
- **Tertiary (Terracotta):** Used sparingly for accents, nutritional highlights, or seasonal categories.
- **Neutral (Off-White):** The foundation of the UI (#FAFAFA). This soft white reduces glare and provides a clean canvas for photography.
- **Surface:** Pure white (#FFFFFF) is used for cards and elevated elements to create subtle depth against the off-white background.

## Typography

This design system uses a high-contrast typographic pairing to signal both tradition and clarity. 

**Newsreader** is the editorial voice of the system. It is used for recipe titles and section headers to convey a sense of history and culinary authority. 

**Work Sans** is the functional workhorse. It is used for ingredient lists, step-by-step instructions, and metadata. Its neutral, open character ensures maximum legibility even when the user's phone is propped up at a distance on a kitchen counter.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for mobile devices. 
- **Margins:** A standard 20px margin is maintained on the left and right edges of the screen to prevent content from feeling cramped.
- **Rhythm:** An 8px linear scale governs all vertical spacing.
- **Vertical Flow:** Use `lg` (32px) spacing between major sections (e.g., between the recipe image and the ingredients list) and `sm` (16px) for internal grouping.
- **Mobile Reflow:** For tablet views, the layout transitions to a 2-column masonry grid for recipe discovery feeds, while maintaining a single-column centered focus for the actual cooking mode.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Ambient Shadows**. 

The background sits at the lowest level (#FAFAFA). Interactive cards and containers sit on a surface layer (#FFFFFF). To create a soft, inviting feel, use "Extra-diffused" shadows:
- **Card Shadow:** `0px 4px 20px rgba(38, 70, 83, 0.06)`. The slight inclusion of the secondary color (Forest Green) in the shadow tint prevents it from looking "dirty" or grey, keeping the aesthetic organic.
- **Floating Actions:** Primary buttons use a more pronounced shadow to indicate tapability: `0px 8px 16px rgba(244, 162, 97, 0.2)`.

## Shapes

The shape language is "Rounded" and organic, mirroring the curves of artisanal cookware and fresh produce. 
- **Standard Radius:** 16px (`rounded-lg`) is the default for all recipe cards, ingredient images, and input fields.
- **Button Radius:** 12px for a sturdy, tactile feel.
- **Icon Enclosures:** Small circular backgrounds for difficulty and time icons to create a "badge" effect.

## Components

### Recipe Cards
The primary discovery element. These must feature full-bleed high-quality photography at the top with a 16px corner radius. The bottom section of the card (white background) contains the title in `headline-md` and a metadata row.

### Metadata Chips
Use small, rounded-pill chips with a light tint of the Primary color (10% opacity) for attributes like "Gluten-Free" or "30 Mins." Icons within these chips should be minimalist 2pt stroke weight.

### Buttons
- **Primary:** Saffron background with white text. High-contrast and elevated.
- **Secondary:** Forest Green outline with 2px stroke. Used for "Save for Later" or "Add to Collection."

### Step-by-Step Lists
Instruction steps should use a "Large Number" style. The number should be in the Secondary color using `headline-md`, while the instruction text sits to the right in `body-md`.

### Tab Navigation
A persistent bottom navigation bar using a blurred white background (Glassmorphism effect). Active states are indicated by the Primary Saffron color and a subtle 4px top-indicator bar.

### Cooking Mode Toggle
A prominent floating action button (FAB) that triggers a "Hands-Free" or "Step-by-Step" view, utilizing a full-screen modal with simplified typography for maximum distance-readability.