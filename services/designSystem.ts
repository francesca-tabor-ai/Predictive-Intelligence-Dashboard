/**
 * Design system configuration for slide rendering
 * Follows Intelligence-First branding for Predictive Intelligence Flywheel Dashboard
 * 
 * Design Philosophy: "Intelligence-First"
 * High-end financial terminal for the AI era with extreme legibility,
 * high-contrast hierarchy, and geometric precision.
 */

export const theme = {
  fonts: {
    primary: 'Inter', // Sans-serif
    mono: 'monospace' // For data/code
  },
  colors: {
    // Core Palette
    deepSpace: '#020617', // Tailwind slate-950 - Background for dark sections
    pureWhite: '#FFFFFF', // Primary workspace color
    obsidian: '#000000', // Font-black headers for maximum authority
    coolGrey: {
      light: '#F1F5F9', // slate-100 - Borders/accents
      medium: '#E2E8F0' // slate-200 - Structural separation
    },
    // Intelligence Gradient (135° linear)
    // Used sparingly for progress bars, underlines, high-energy icons
    gradient: {
      indigo: '#6366f1', // Start
      purple: '#a855f7', // Mid
      pink: '#ec4899', // End
      orange: '#f97316' // Accent
    },
    // Status & Semantic Colors
    semantic: {
      exceptional: '#10b981', // Emerald-500 - High Impact
      attractive: '#6366f1', // Indigo-500 - Medium Impact
      neutral: '#94a3b8', // Slate-400
      risk: '#f43f5e' // Rose-500 - Avoid
    },
    // Text colors
    text: {
      primary: '#000000', // Obsidian
      secondary: '#475569', // slate-600 for body
      muted: '#94a3b8' // slate-400 for metadata
    }
  },
  layout: {
    // Heavy Rounding System
    borderRadius: {
      executive: 48, // Main report panels
      standard: 44, // Main report panels (alternative)
      input: 24, // Input components
      button: 20 // Buttons (pill-shaped)
    },
    // Spacing - "Breathing Room" strategy
    spacing: {
      gap12: 48, // gap-12
      gap16: 64, // gap-16
      spaceY24: 96 // space-y-24
    },
    // Slide layout
    slidePadding: 64, // Padding for slide canvas
    slideMargin: 48 // Margin between elements
  },
  typography: {
    // Display Headers - font-black text-6xl tracking-tight
    display: {
      fontSize: 60, // text-6xl
      fontWeight: 900, // font-black
      letterSpacing: -0.025, // tracking-tight
      lineHeight: 1.1,
      color: '#000000' // Obsidian
    },
    // Section Headers - font-bold text-2xl tracking-tight
    section: {
      fontSize: 24, // text-2xl
      fontWeight: 700, // font-bold
      letterSpacing: -0.025, // tracking-tight
      lineHeight: 1.3,
      color: '#000000' // Obsidian
    },
    // Metadata / Overlines - font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400
    metadata: {
      fontSize: 10,
      fontWeight: 700, // font-bold
      textTransform: 'uppercase' as const,
      letterSpacing: 0.2, // tracking-[0.2em]
      color: '#94a3b8' // text-slate-400
    },
    // Body Copy - font-light text-lg leading-relaxed text-slate-600
    body: {
      fontSize: 18, // text-lg
      fontWeight: 300, // font-light
      lineHeight: 1.75, // leading-relaxed
      color: '#475569' // text-slate-600
    },
    // Data/Code - font-mono text-sm tracking-tighter
    data: {
      fontSize: 14, // text-sm
      fontFamily: 'monospace',
      letterSpacing: -0.05, // tracking-tighter
      color: '#000000'
    }
  },
  shadows: {
    // Shadow-2xl for executive panels
    executive: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  }
};

export type Theme = typeof theme;
