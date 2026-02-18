/**
 * Design system configuration for slide rendering
 * Follows Intelligence-First branding
 */

export const theme = {
  fonts: {
    title: 'Inter',
    body: 'Inter',
    mono: 'Courier New'
  },
  colors: {
    primary: '#0A2540',
    accent: '#635BFF',
    background: '#FFFFFF',
    surface: '#F1F5F9',
    text: {
      primary: '#000000',
      secondary: '#475569',
      muted: '#94a3b8'
    },
    gradient: {
      start: '#6366f1',
      mid: '#a855f7',
      end: '#ec4899',
      accent: '#f97316'
    },
    semantic: {
      exceptional: '#10b981',
      medium: '#6366f1',
      neutral: '#94a3b8',
      risk: '#f43f5e'
    }
  },
  layout: {
    margin: 64,
    padding: 48,
    borderRadius: {
      executive: 48,
      standard: 44,
      button: 20,
      panel: 32
    }
  },
  typography: {
    display: {
      fontSize: 64,
      fontWeight: 900,
      letterSpacing: -0.02,
      lineHeight: 1.1
    },
    section: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1.3
    },
    body: {
      fontSize: 18,
      fontWeight: 300,
      lineHeight: 1.8,
      color: '#475569'
    },
    metadata: {
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.2,
      color: '#94a3b8'
    },
    data: {
      fontSize: 14,
      fontFamily: 'monospace'
    }
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 48,
    xl: 64
  }
};

export type Theme = typeof theme;
