import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from '@mui/material'

const therapies = [
  'Vamana',
  'Virechana',
  'Basti',
  'Nasya',
  'Raktamokshana'
]

export default function ScheduleDialog({ open, onClose, defaultDay }) {
  const [form, setForm] = useState({ patient: '', therapy: therapies[0], time: '' })

  function updateField(key, value) { setForm(f => ({ ...f, [key]: value })) }

  function handleSave() {
    // Placeholder: integrate with API later
    onClose({ ...form, day: defaultDay })
  }

  return (
    <Dialog open={open} onClose={() => onClose(null)} fullWidth maxWidth="sm">
      <DialogTitle>Schedule session {defaultDay ? `– ${defaultDay}` : ''}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Patient name" value={form.patient} onChange={e => updateField('patient', e.target.value)} fullWidth />
          <TextField select label="Therapy" value={form.therapy} onChange={e => updateField('therapy', e.target.value)} fullWidth>
            {therapies.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField label="Time" type="time" value={form.time} onChange={e => updateField('time', e.target.value)} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}


