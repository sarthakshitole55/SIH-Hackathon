import React, { useState } from 'react'
import { Box, ButtonGroup, Button, Typography, Divider } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import RegisterIcon from '@mui/icons-material/PersonAddAlt1'
import AuthLayout from './AuthLayout'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const isLogin = mode === 'login'

  return (
    <AuthLayout 
      title={isLogin ? 'Welcome back' : 'Join AyurSutra'} 
      subtitle={isLogin ? 'Sign in to continue to your clinic workspace.' : 'Create your account to get started.'}
    >
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {isLogin ? 'Login' : 'Create account'}
        </Typography>
        <ButtonGroup variant="outlined" sx={{ width: '100%' }}>
            <Button 
              startIcon={<LoginIcon />} 
              onClick={() => setMode('login')} 
              variant={isLogin ? 'contained' : 'outlined'} 
              fullWidth
            >
              Login
            </Button>
            <Button 
              startIcon={<RegisterIcon />} 
              onClick={() => setMode('register')} 
              variant={!isLogin ? 'contained' : 'outlined'} 
              fullWidth
            >
              Sign Up
            </Button>
        </ButtonGroup>
        <Divider sx={{ my: 1 }} />
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </Box>
    </AuthLayout>
  )
}


