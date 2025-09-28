import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, TextField, Typography, Box, Alert } from '@mui/material'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import AuthLayout from './AuthLayout'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your clinic workspace.">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Sign in to continue to your clinic workspace.</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField 
          label="Email Address" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          fullWidth 
        />
        <TextField 
          label="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          fullWidth 
        />
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </Button>
      </Box>
      <Typography sx={{ mt: 2 }}>
        No account? <Link to="/register">Create one</Link>
      </Typography>
    </AuthLayout>
  )
}


