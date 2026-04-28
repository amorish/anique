---
name: Cinematic Noir
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
  on-surface-variant: '#e9bcb6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#af8782'
  outline-variant: '#5e3f3b'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#690003'
  primary-container: '#e50914'
  on-primary-container: '#fff7f6'
  inverse-primary: '#c0000c'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#a7c8ff'
  on-tertiary: '#003061'
  tertiary-container: '#0072d7'
  on-tertiary-container: '#f8f9ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930007'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#d5e3ff'
  tertiary-fixed-dim: '#a7c8ff'
  on-tertiary-fixed: '#001b3c'
  on-tertiary-fixed-variant: '#004689'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  h1:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is engineered for AniQue to evoke the high-stakes atmosphere of a premier cinema experience. The brand personality is sophisticated, immersive, and dramatic, targeting an audience that values curation and visual depth. 

The aesthetic leans heavily into **Glassmorphism** and **Minimalism**. By using translucent layers and deep background blurs, the interface creates a sense of physical space and "depth of field," mimicking high-end lens optics. The emotional response is intended to be one of "focused luxury"—where the interface recedes to let the content (anime/media) take center stage.

## Colors

The palette is anchored in a deep, "Noir" foundation. The primary background uses a true-dark `#121212` to maximize OLED contrast and power efficiency. The secondary surface, `#1e1e1e`, is used for elevated containers and structural elements.

The accent color, `#e50914`, is reserved for high-impact actions, critical status indicators, and brand-touchpoint highlights. To maintain the cinematic feel, use white for primary text and a 60% opacity white for secondary metadata to ensure a hierarchy that doesn't compete with the bold red accents.

## Typography

The typography strategy balances modern geometric flair with utilitarian precision. **Outfit** is utilized for all headings to provide a distinctive, fashion-forward character that feels premium and architectural. 

**Inter** is the workhorse for body text, UI labels, and data-heavy components. It ensures maximum readability at small sizes across diverse screen resolutions. For high-density labels, use Inter in uppercase with slight tracking to maintain a "technical" or "metadata" aesthetic common in cinematic production credits.

## Layout & Spacing

The design system employs a **12-column fluid grid** for web and a **4-column grid** for mobile. The rhythm is based on a 4px baseline, ensuring all vertical spacing is divisible by 4 or 8.

Margins and gutters are generous (`32px` margins on desktop) to prevent the dark UI from feeling cramped. Content should be grouped into logical "clusters" using whitespace as the primary separator rather than heavy lines, reinforcing the minimalist philosophy.

## Elevation & Depth

Depth is communicated through **Glassmorphism** rather than traditional drop shadows. Surfaces are layered using the following stack:
1. **Base Layer:** `#121212` solid.
2. **Surface Layer:** `#1e1e1e` with a 1px inner border (`rgba(255,255,255,0.1)`) to define edges.
3. **Floating Layer:** Background blur (20px to 40px) with a semi-transparent `#1e1e1e` fill.

Shadows, when used, are "Ambient Glows"—highly diffused, large radius, and low opacity (5-10%), often tinted with a subtle hint of the primary red when an element is in an "active" or "hover" state.

## Shapes

The shape language is consistently **Rounded**. A default `0.5rem` (8px) radius applies to most standard components like buttons and input fields. For larger layout containers and media cards, use `rounded-lg` (16px) or `rounded-xl` (24px) to create a soft, modern silhouette that contrasts against the sharp, geometric typography of the headings.

## Components

**Buttons:** Primary buttons use the `#e50914` background with white text. Secondary buttons should be glass-based: a semi-transparent dark fill with a subtle white border.

**Cards:** Media cards utilize "Glass Cards" with no visible border on the bottom. Information overlays should appear with a backdrop-filter blur when hovered.

**Chips:** Small, pill-shaped elements used for genres or tags. Use a dark grey fill with high transparency to let the background peak through.

**Inputs:** Input fields are dark containers with a 1px bottom-border highlight that turns primary red upon focus.

**Progress Bars:** Thin, high-contrast lines. The "track" is low-opacity white, while the "fill" is primary red, often accompanied by a subtle outer glow to simulate a light-box effect.

**Additional Components:** 
- **Backdrop Blurs:** Essential for navigation bars and sidebars.
- **Hero Carousels:** Large-scale imagery with a vertical gradient fade into the `#121212` background.