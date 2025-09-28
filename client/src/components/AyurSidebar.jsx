import React from 'react'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/SpaceDashboard'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import InventoryIcon from '@mui/icons-material/Inventory2'
import ReceiptIcon from '@mui/icons-material/ReceiptLong'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Role-specific navigation items
const getNavigationItems = (role) => {
  switch (role) {
    case 'admin':
      return [
        { to: '/dashboard', icon: <DashboardIcon />, label: 'Overview' },
        { to: '/dashboard/appointments', icon: <EventIcon />, label: 'Appointments' },
        { to: '/dashboard/patients', icon: <PeopleIcon />, label: 'Patients' },
        { to: '/dashboard/therapies', icon: <MedicalServicesIcon />, label: 'Therapies' },
        { to: '/dashboard/inventory', icon: <InventoryIcon />, label: 'Inventory' },
        { to: '/dashboard/billing', icon: <ReceiptIcon />, label: 'Billing' },
      ]
    case 'doctor':
      return [
        { to: '/dashboard/schedule', icon: <CalendarTodayIcon />, label: 'My Schedule' },
        { to: '/dashboard/patients', icon: <PeopleIcon />, label: 'My Patients' },
        { to: '/dashboard/doctor-appointments', icon: <EventIcon />, label: 'Appointments' },
        { to: '/dashboard/treatment-plans', icon: <MedicalServicesIcon />, label: 'Treatment Plans' },
      ]
    case 'patient':
      return [
        { to: '/dashboard', icon: <DashboardIcon />, label: 'Overview' },
        { to: '/dashboard/appointments', icon: <CalendarTodayIcon />, label: 'My Sessions' },
        { to: '/dashboard/therapies', icon: <HealthAndSafetyIcon />, label: 'My Therapies' },
        { to: '/dashboard/billing', icon: <ReceiptIcon />, label: 'My Bills' },
        { to: '/dashboard/book', icon: <BookOnlineIcon />, label: 'Book Session' },
      ]
    default:
      return [
        { to: '/dashboard', icon: <DashboardIcon />, label: 'Overview' },
      ]
  }
}

export default function AyurSidebar() {
  const location = useLocation()
  const { user } = useAuth()
  
  const items = getNavigationItems(user?.role)
  
  const getPortalTitle = (role) => {
    switch (role) {
      case 'admin': return 'Admin Panel'
      case 'doctor': return 'Doctor Portal'
      case 'patient': return 'Patient Portal'
      default: return 'Navigation'
    }
  }
  
  return (
    <Box sx={{ position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh', width: 260, p: 2.5, borderRight: '1px solid rgba(11,59,46,0.12)', background: 'rgba(245,241,232,0.6)', backdropFilter: 'blur(6px)', display: { xs: 'none', md: 'block' } }}>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {getPortalTitle(user?.role)}
      </Typography>
      <List>
        {items.map((item) => {
          const active = location.pathname === item.to
          return (
            <ListItemButton key={item.to} component={Link} to={item.to} selected={active} sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36, color: active ? 'secondary.main' : 'text.secondary' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
      <Divider sx={{ my: 2 }} />
      
      {/* Language Switcher */}
      
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {user?.name && `${user.name} (${user.role})`}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>AyurSutra ©</Typography>
    </Box>
  )
}


