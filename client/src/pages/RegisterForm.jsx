import React, { useState } from 'react'
import { Button, TextField, Box, MenuItem, Alert } from '@mui/material'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const roles = [
  { value: 'patient', label: 'Patient' },
  { value: 'therapist', label: 'Doctor/Therapist' }
]

export default function RegisterForm() {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(key, value) { setForm(f => ({ ...f, [key]: value })) }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      setToken(data.token)
      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Full Name" value={form.name} onChange={e => updateField('name', e.target.value)} required fullWidth />
      <TextField label="Email" value={form.email} onChange={e => updateField('email', e.target.value)} required fullWidth />
      <TextField label="Password" type="password" value={form.password} onChange={e => updateField('password', e.target.value)} required fullWidth />
      <TextField select label="Role" value={form.role} onChange={e => updateField('role', e.target.value)} fullWidth>
        {roles.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
      </TextField>
      <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
    </Box>
  )
}


