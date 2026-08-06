---
name: Kinetic Enterprise
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#434655'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#515659'
  on-tertiary: '#ffffff'
  tertiary-container: '#696e71'
  on-tertiary-container: '#edf1f5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dfe3e7'
  tertiary-fixed-dim: '#c3c7cb'
  on-tertiary-fixed: '#171c1f'
  on-tertiary-fixed-variant: '#43474b'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for high-density administrative workflows where clarity, speed, and precision are paramount. The brand personality is professional and understated, drawing inspiration from high-performance productivity tools. 

The aesthetic follows a **Modern Minimalist** approach characterized by:
- **Functional Transparency:** Using whitespace and subtle borders rather than heavy colors to define regions.
- **Precision Engineering:** A strict adherence to a 4px/8px grid system to evoke a sense of organized stability.
- **Subtle Sophistication:** Leveraging soft shadows and semi-transparent layers to create a "glass-on-paper" depth.
- **Focus-Driven UI:** Removing unnecessary decorative elements to ensure user attention remains on data and actionable insights.

## Colors

This design system utilizes a high-contrast palette optimized for legibility and prolonged usage. 

- **Core Palette:** The primary blue is used sparingly for primary actions and active states. The neutral scale is biased toward cool grays to maintain a modern, "tech-forward" feel.
- **Semantic Logic:** Success, Warning, and Error colors are strictly reserved for status indicators and destructive actions. 
- **Surface Strategy:** The background uses a very light gray to reduce eye strain, while the primary surface (white) is used to lift content containers.

## Typography

The typography system relies on **Inter** for its exceptional legibility in data-heavy environments and its neutral, systematic character.

- **Scale:** Headlines use tighter letter-spacing and heavier weights to create immediate hierarchy.
- **Data Display:** `body-md` (14px) is the standard for most interface text, providing a balance between information density and readability.
- **Labels:** Small labels use increased tracking (letter-spacing) and medium/bold weights to ensure they remain legible at 11px and 12px.

## Layout & Spacing

The layout philosophy is built on a **Fluid-Fixed Hybrid Grid**. 

- **The Grid:** A 12-column system is used for the main content area. Sidebars are fixed-width (typically 240px or 280px) to maximize horizontal space for data tables.
- **Rhythm:** All spacing must be a multiple of 4px. 16px (`md`) is the default padding for containers, while 8px (`sm`) is used for internal element grouping.
- **Adaptivity:** 
  - **Desktop:** Wide margins (32px) and generous gutters.
  - **Tablet:** Sidebars collapse into icons or hide behind a scrim.
  - **Mobile:** Single column layout with reduced margins (16px).

## Elevation & Depth

Visual hierarchy is achieved through a combination of **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Background):** #F9FAFB. Used for the base canvas.
- **Level 1 (Card/Surface):** #FFFFFF. White containers with a 1px border (#E2E8F0) and a very subtle shadow (Y: 1px, Blur: 3px, Opacity: 0.05).
- **Level 2 (Popovers/Dropdowns):** #FFFFFF. Floating elements use a more pronounced, diffused shadow (Y: 10px, Blur: 20px, Opacity: 0.1) to clearly separate them from the primary surface.
- **Active State:** Elements like pressed buttons or selected cards use a slight inset shadow or a 2px primary-colored border.

## Shapes

The shape language is "Soft-Modern," using consistent corner radii to soften the industrial nature of ERP software.

- **Standard Elements:** 0.5rem (8px) is the default for buttons, input fields, and small cards.
- **Large Containers:** `rounded-lg` (16px) is used for main dashboard widgets and modal windows.
- **Interactive Indicators:** Small 4px radii are used for checkboxes and status tags to maintain a crisp look.

## Components

### Buttons
- **Primary:** Solid blue (#2563EB) with white text. 8px corner radius.
- **Secondary:** White surface with a 1px border (#D1D5DB). Text in #374151.
- **Ghost:** No background or border; used for secondary actions in headers.

### Input Fields
- White background with a 1px gray border. On focus, the border transitions to Primary Blue with a 3px soft blue glow (ring).
- Placeholder text: #9CA3AF.

### Data Tables
- Header rows use a light gray background (#F8FAFC) and bold, uppercase labels.
- Rows use a subtle hover state (#F1F5F9) to help users track information across wide screens.

### Chips & Tags
- Status tags (e.g., "Paid", "Pending") use a light background of the semantic color (10% opacity) and high-contrast text of the same hue.

### Cards
- White background, 1px border (#E2E8F0), 8px corner radius. Used to group related data points or metrics.

### Icons
- Use 2px stroke-width minimalist icons. Avoid filled icons unless indicating an "Active" or "Selected" state.