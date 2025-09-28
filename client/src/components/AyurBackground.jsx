import React from 'react'
import { Box } from '@mui/material'

export default function AyurBackground() {
  return (
    <Box aria-hidden sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <Box className="gradient-veil" />
      <Box className="orb floatY" sx={{ width: 320, height: 320, top: 40, left: -40, backgroundColor: 'rgba(11,59,46,0.25)' }} />
      <Box className="orb floatX" sx={{ width: 220, height: 220, top: 160, right: -60, backgroundColor: 'rgba(194,166,105,0.28)' }} />
      <Box className="orb floatY" sx={{ width: 260, height: 260, bottom: -60, left: 120, backgroundColor: 'rgba(11,59,46,0.22)' }} />
    </Box>
  )
}


