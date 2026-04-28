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
  tertiary: '#c8c6c5'
  on-tertiary: '#303030'
  tertiary-container: '#737272'
  on-tertiary-container: '#fbf8f8'
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
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Spline Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Spline Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  title-sm:
    fontFamily: Spline Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
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
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built to evoke the immersive, high-stakes atmosphere of modern anime cinematography. It targets a demographic that values aesthetic precision and "pro-sumer" level tracking tools. The brand personality is sophisticated yet energetic, utilizing a "Red Carpet" philosophy where the user's media content is the star, and the UI acts as a premium gallery.

The style is a hybrid of **Minimalism** and **Glassmorphism**. By stripping away unnecessary decorative elements and focusing on translucent layering, the design system achieves a sense of depth and physical space without cluttering the visual field. This "Nocturnal" aesthetic ensures that long-term usage—common for binge-watching—is easy on the eyes while feeling high-end and exclusive.

## Colors

The palette is anchored in a "True Dark" foundation. The primary background uses a deep black (#121212) to ensure OLED screens achieve infinite contrast and power efficiency. Surfaces and containers use a slightly elevated dark gray (#1e1e1e) to create a clear distinction between the canvas and interactive elements.

The accent color—a vibrant, high-chroma red (#e50914)—is reserved strictly for primary calls to action, active states, and critical brand moments. This "Crimson Spark" creates a violent contrast against the dark base, guiding the user's eye instantly to progress bars, "Watch Now" buttons, and notifications. Secondary elements utilize muted grays to maintain a sophisticated hierarchy.

## Typography

This design system employs a dual-font strategy to balance character with legibility. **Spline Sans** is used for all headings and display text; its geometric yet slightly playful letterforms mirror the dynamic nature of animation titles. Headings should be set with tight letter-spacing to feel impactful and modern.

For functional text, **Inter** provides a neutral, highly readable foundation. It handles dense metadata—such as episode descriptions and studio credits—with professional clarity. Capitalized labels in Inter with increased tracking are used for technical data (e.g., "GENRE," "SEASON") to differentiate them from narrative body text.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model on desktop and a **Fluid Grid** on mobile, built on an 8px rhythmic increment. Content is organized into a 12-column structure with generous 24px gutters to allow the high-detail anime poster art to breathe.

Horizontal "Shelf" layouts are preferred for browsing, allowing users to scroll through categories without losing their vertical place. Large margins (32px+) on the edges of the screen reinforce the premium, editorial feel, moving away from "busy" dashboard styles toward a focused, cinematic viewing experience.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and tonal layering rather than traditional drop shadows. Instead of casting shadows downward, depth is created by "lifting" elements closer to the user using increasing levels of transparency and background blurs.

The base layer is the solid deep black. Level 1 surfaces (cards, sidebars) use the dark gray surface color with a subtle 1px border (#ffffff at 10% opacity). Level 2 surfaces (modals, dropdowns) utilize a "Frosted Glass" effect: a semi-transparent fill with a 20px-40px background blur. This allows the colors of the anime artwork underneath to bleed through softly, creating a dynamic, color-aware UI that feels integrated with the media.

## Shapes

The shape language is consistently **Rounded**, utilizing a 0.5rem (8px) base radius for standard components and 1.5rem (24px) for large containers and featured hero cards. This curvature softens the high-contrast color palette, making the interface feel modern and approachable rather than aggressive.

Image containers must always match the corner radius of their parent cards to maintain a nested, "fitted" look. Buttons follow the Pill-shaped convention (Level 3) to create a distinct interactive language that separates them from the rectangular layout of the media cards.

## Components

### Cards
The core of the design system. Cards feature a vertical 2:3 aspect ratio for posters. They use a subtle 1px border and no shadow. Titles are overlaid on a bottom-aligned gradient scrim to ensure legibility. On hover, cards should scale slightly (1.05x) and increase the border opacity.

### Buttons
Primary buttons are solid Crimson (#e50914) with white text. Secondary buttons use a "Ghost" style with a 1px border and a subtle glass background. Icons within buttons should be 20px, opting for "Linear" style weights to match the sleek typography.

### Chips & Tags
Used for genres and status (e.g., "Currently Watching"). These are small, low-contrast capsules with dark gray backgrounds. For high-priority tags like "Trending," use a subtle red glow effect (outer stroke).

### Inputs
Search bars and text fields use a dark, inset appearance with a 1px border that glows Crimson when focused. The background blur is essential here to keep the search interface feeling like a layer above the content.

### Progress Bars
Used for episode tracking. The background track is a dark gray, while the active fill is the primary Crimson. A subtle outer glow on the progress head adds a "living" energy to the tracker.