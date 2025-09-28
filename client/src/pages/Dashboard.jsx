import React from 'react'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from './AdminDashboard'
import DoctorDashboard from './DoctorDashboard'
import PatientDashboard from './PatientDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  // Route to appropriate dashboard based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />
    case 'doctor':
      return <DoctorDashboard />
    case 'patient':
      return <PatientDashboard />
    default:
      // Default to admin dashboard if role is not recognized
      return <AdminDashboard />
  }
}