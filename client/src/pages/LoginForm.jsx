import React, { useState } from 'react'
import { Button, TextField, Box, Alert, InputAdornment, IconButton, FormControlLabel, Checkbox, Typography, Divider } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockIcon from '@mui/icons-material/Lock'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
      {error && <Alert severity="error" className="fade-in-up">{error}</Alert>}
      <TextField
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          )
        }}
      />
      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(s => !s)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
        <Button size="small" variant="text">Forgot password?</Button>
      </Box>
      <Button type="submit" variant="contained" size="large" disabled={loading} className="hover-lift">
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <Divider textAlign="center">or</Divider>
      <Button variant="outlined" size="large" onClick={() => { setEmail('demo@ayursutra.dev'); setPassword('demo123'); }}>
        Use demo credentials
      </Button>
      <Box sx={{ mt: 1, display: 'grid', gap: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>By continuing you agree to our Terms and Privacy.</Typography>
      </Box>
    </Box>
  )
}


