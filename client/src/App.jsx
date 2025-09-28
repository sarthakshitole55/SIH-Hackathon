import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Auth from './pages/Auth.jsx'
import AyurBackground from './components/AyurBackground.jsx'
import AyurHeader from './components/AyurHeader.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MySessions from './pages/MySessions.jsx'
import MyTherapies from './pages/MyTherapies.jsx'
import MyBills from './pages/MyBills.jsx'
import BookSession from './pages/BookSession.jsx'
import MySchedule from './pages/MySchedule.jsx'
import MyPatients from './pages/MyPatients.jsx'
import DoctorAppointments from './pages/DoctorAppointments.jsx'
import TreatmentPlans from './pages/TreatmentPlans.jsx'
import InventoryManagement from './pages/InventoryManagement.jsx'


export default function App() {
  return (
    <AuthProvider>
      <AyurBackground />
      <AyurHeader />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/appointments" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
        <Route path="/dashboard/therapies" element={<ProtectedRoute><MyTherapies /></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute><MyBills /></ProtectedRoute>} />
        <Route path="/dashboard/book" element={<ProtectedRoute><BookSession /></ProtectedRoute>} />
        <Route path="/dashboard/schedule" element={<ProtectedRoute><MySchedule /></ProtectedRoute>} />
        <Route path="/dashboard/patients" element={<ProtectedRoute><MyPatients /></ProtectedRoute>} />
        <Route path="/dashboard/doctor-appointments" element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />
        <Route path="/dashboard/treatment-plans" element={<ProtectedRoute><TreatmentPlans /></ProtectedRoute>} />
        <Route path="/dashboard/inventory" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
        <Route path="*" element={<Auth />} />
      </Routes>
    </AuthProvider>
  )
}


