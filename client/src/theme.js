export const themeOptions = {
  palette: {
    primary: { main: '#0B3B2E' }, // deep heritage green
    secondary: { main: '#C2A669' }, // muted gold
    success: { main: '#5BA37F' },
    warning: { main: '#D1B06B' },
    background: { default: '#F5F1E8' }, // warm cream
  },
  typography: {
    fontFamily: 'Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    h1: { fontFamily: 'Playfair Display, serif', fontWeight: 700 },
    h2: { fontFamily: 'Playfair Display, serif', fontWeight: 700 },
    h3: { fontFamily: 'Playfair Display, serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingTop: 12,
          paddingBottom: 12,
          border: '1px solid rgba(194,166,105,0.35)'
        },
        containedPrimary: {
          background: 'linear-gradient(90deg,#0B3B2E 0%,#0E4A3A 100%)',
          boxShadow: '0 8px 20px rgba(11,59,46,0.25)',
          ':hover': {
            background: 'linear-gradient(90deg,#093528 0%,#0C3F31 100%)',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 14,
          border: '1px solid rgba(11,59,46,0.15)'
        },
        elevation1: {
          boxShadow: '0 24px 60px rgba(11,59,46,0.12)'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      }
    }
  }
}
