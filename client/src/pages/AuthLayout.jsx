import React from 'react'
import { Box, Typography } from '@mui/material'
import SpaIcon from '@mui/icons-material/Spa'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, minHeight: '100vh', position: 'relative' }}>
      <Box sx={{ position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
        <Box className="gradient-veil" />
        <Box className="orb floatY" sx={{ width: 220, height: 220, top: 80, left: 120, backgroundColor: 'rgba(194,166,105,0.35)' }} />
        <Box className="orb floatX" sx={{ width: 160, height: 160, bottom: 120, right: 80, backgroundColor: 'rgba(11,59,46,0.35)' }} />
        <Box sx={{ position: 'relative', height: '100%', p: 8, color: 'white', background: 'linear-gradient(180deg,#0B3B2E 0%,#0E4A3A 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpaIcon sx={{ fontSize: 40 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: 0.5 }}>AyurSutra</Typography>
          </Box>
          <Typography variant="h5" sx={{ opacity: 0.95 }}>{title}</Typography>
          {subtitle && <Typography sx={{ mt: 1.5, opacity: 0.85, maxWidth: 480 }}>{subtitle}</Typography>}
          <Box sx={{ mt: 4, display: 'grid', gap: 2 }}>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>• Panchakarma scheduling without conflicts</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>• Smart therapist & room allocation</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>• Inventory & billing built-in</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: { xs: 3, md: 6 }, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#F5F1E8 0%,#EFE9DD 100%)' }}>
        <Box className="fade-in-up hover-lift" sx={{ width: '100%', maxWidth: 560, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: 4, boxShadow: '0 24px 80px rgba(11,59,46,0.18)', p: { xs: 3, md: 5 }, border: '1px solid rgba(11,59,46,0.12)' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
