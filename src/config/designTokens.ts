export const tokens = {
  colors: {
    background: {
      deep: '#020203',
      base: '#050506',
      elevated: '#0A0A0C',
    },
    foreground: {
      base: '#EDEDEF',
      muted: '#8A8F98',
    },
    accent: {
      base: '#5E6AD2',
      bright: '#6872D9',
      glow: 'rgba(94, 106, 210, 0.3)',
    },
    border: {
      default: 'rgba(255, 255, 255, 0.06)',
      hover: 'rgba(255, 255, 255, 0.10)',
      accent: 'rgba(94, 106, 210, 0.30)',
    }
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-inter), sans-serif',
      mono: 'var(--font-mono), monospace',
    }
  },
  spacing: {
    unit: 4, // 4px base unit
  },
  radii: {
    container: '16px',
    card: '16px',
    button: '8px',
    input: '8px',
    pill: '9999px',
    icon: '12px',
  },
  animation: {
    duration: {
      quick: '200ms',
      standard: '300ms',
      entrance: '600ms',
      ambient: '8s',
    },
    easing: {
      primary: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }
  }
};
