import React, { useState } from 'react'
import { Box, Grid, Typography, Paper, Chip } from '@mui/material'
import ScheduleDialog from './ScheduleDialog'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function WeekCalendar() {
  const [dialog, setDialog] = useState({ open: false, day: null })
  const [sessions, setSessions] = useState([])

  function openDialog(day) { setDialog({ open: true, day }) }
  function closeDialog(result) {
    setDialog({ open: false, day: null })
    if (result) setSessions(prev => [...prev, result])
  }

  return (
    <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Playfair Display, serif' }}>Week Schedule</Typography>
      <Grid container spacing={1}>
        {days.map((d) => (
          <Grid item xs={12} sm={6} md={3} lg={12/7} key={d}>
            <Box onClick={() => openDialog(d)} sx={{ cursor: 'pointer', border: '1px dashed rgba(11,59,46,0.2)', borderRadius: 2, p: 1.5, minHeight: 90, transition: 'background 200ms ease' }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>{d}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {sessions.filter(s => s.day === d).length === 0 ? (
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Tap to add</Typography>
                ) : (
                  sessions.filter(s => s.day === d).map((s, idx) => (
                    <Chip key={idx} label={`${s.time || '—'} · ${s.therapy} – ${s.patient || 'Patient'}`} size="small" color="secondary" variant="outlined" />
                  ))
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <ScheduleDialog open={dialog.open} onClose={closeDialog} defaultDay={dialog.day} />
    </Paper>
  )
}


