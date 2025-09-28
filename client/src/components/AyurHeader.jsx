import React from 'react'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import SpaIcon from '@mui/icons-material/Spa'

export default function AyurHeader() {
  return (
    <AppBar elevation={0} position="sticky" color="transparent" sx={{ backdropFilter: 'blur(6px)', borderBottom: '1px solid rgba(11,59,46,0.12)', zIndex: 5 }}>
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SpaIcon sx={{ color: 'secondary.main' }} />
          <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>AyurSutra</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}


