import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { themeOptions } from './theme.js'

const theme = createTheme(themeOptions)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        '@keyframes floatUpDown': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        '@keyframes floatSide': {
          '0%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(14px)' },
          '100%': { transform: 'translateX(0px)' }
        },
        '@keyframes bgShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        '.gradient-veil': {
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(120deg, rgba(11,59,46,0.35), rgba(194,166,105,0.25), rgba(11,59,46,0.35))',
          backgroundSize: '200% 200%',
          animation: 'bgShift 18s linear infinite'
        },
        '.orb': {
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(30px)',
          opacity: 0.22
        },
        '.orb.floatY': { animation: 'floatUpDown 14s ease-in-out infinite' },
        '.orb.floatX': { animation: 'floatSide 16s ease-in-out infinite' },
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        '.fade-in-up': { animation: 'fadeInUp 700ms cubic-bezier(0.22,1,0.36,1) 60ms both' },
        '.hover-lift': {
          transition: 'transform 220ms ease, box-shadow 220ms ease',
        },
        '.hover-lift:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 28px 80px rgba(11,59,46,0.22)'
        }
        ,
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' }
        },
        '.shimmer-card': {
          position: 'relative'
        },
        '.shimmer-card:before': {
          content: '""',
          position: 'absolute',
          inset: -1,
          borderRadius: 12,
          padding: 1,
          background: 'linear-gradient(90deg, rgba(194,166,105,0.0), rgba(194,166,105,0.65), rgba(194,166,105,0.0))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3.5s linear infinite'
        }
      }} />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)


