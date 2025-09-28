import React, { useEffect, useState } from 'react'
import { 
  Box, Grid, Card, Typography, Button, List, ListItem, ListItemText, 
  ListItemIcon, Avatar, Chip, Stack, LinearProgress, Paper, Badge
} from '@mui/material'
import { 
  Schedule, People, LocalHospital, AccessTime, 
  PersonAdd, Today, PendingActions, CheckCircle
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import WeekCalendar from '../components/WeekCalendar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, patientsRes, metricsRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/patients'),
          api.get('/metrics')
        ])
        
        // For doctor role, use demo doctor data
        const doctorAppointments = appointmentsRes.data.appointments?.filter(apt => 
          apt.doctorName === 'Dr. Rajesh Kumar' || apt.doctorName === 'Dr. Sunita Reddy'
        ) || []
        
        const doctorPatients = patientsRes.data.patients?.filter(patient => 
          patient.doctor === 'Dr. Rajesh Kumar' || patient.doctor === 'Dr. Sunita Reddy'
        ) || []

        setAppointments(doctorAppointments)
        setPatients(doctorPatients)
        setMetrics(metricsRes.data)
        
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback data if API fails
        setAppointments([
          {
            id: '1',
            patientName: 'Priya Sharma',
            therapy: 'Abhyanga',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            doctorName: 'Dr. Rajesh Kumar',
            status: 'confirmed',
            duration: 60,
            room: 'Therapy Room 1'
          },
          {
            id: '2',
            patientName: 'Amit Patel',
            therapy: 'Panchakarma',
            date: new Date().toISOString().split('T')[0],
            time: '10:30',
            doctorName: 'Dr. Rajesh Kumar',
            status: 'in-progress',
            duration: 120,
            room: 'Panchakarma Suite A'
          },
          {
            id: '3',
            patientName: 'Deepika Reddy',
            therapy: 'Nasya',
            date: new Date().toISOString().split('T')[0],
            time: '11:30',
            doctorName: 'Dr. Rajesh Kumar',
            status: 'completed',
            duration: 30,
            room: 'Therapy Room 1'
          }
        ])
        setPatients([
          {
            id: 'P001',
            name: 'Priya Sharma',
            age: 34,
            medicalHistory: ['Hypertension', 'Stress'],
            totalVisits: 12,
            lastVisit: '2024-12-20',
            status: 'active'
          },
          {
            id: 'P007',
            name: 'Deepika Reddy',
            age: 29,
            medicalHistory: ['Sinusitis', 'Allergic Rhinitis'],
            totalVisits: 8,
            lastVisit: '2024-12-20',
            status: 'active'
          },
          {
            id: 'P011',
            name: 'Sunita Agarwal',
            age: 33,
            medicalHistory: ['PCOS', 'Irregular Menstruation'],
            totalVisits: 4,
            lastVisit: '2024-12-18',
            status: 'active'
          }
        ])
        setMetrics({
          totalPatients: 15,
          sessionsToday: 8,
          successRate: 94
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  )

  const pendingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' || apt.status === 'confirmed'
  )

  const completedToday = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0] && apt.status === 'completed'
  )
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'in-progress': return 'warning'
      case 'scheduled': return 'info'
      case 'completed': return 'default'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
        <AyurSidebar />
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
      <AyurSidebar />
      <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, mb: 3 }}>
          Doctor Dashboard - {user?.name || 'Dr. Name'}
        </Typography>

        {/* Doctor Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Today />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Today's Sessions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {todayAppointments.length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                {completedToday.length} completed
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    My Patients
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {patients.length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                Active cases
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <PendingActions />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Pending Reviews
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {pendingAppointments.length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'warning.main' }}>
                Awaiting confirmation
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Success Rate
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    94%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={94} 
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </Card>
          </Grid>
        </Grid>

        {/* Doctor-Specific Sections */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Today's Schedule */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1 }} />
                Today's Schedule
              </Typography>
              <List>
                {todayAppointments.map((appointment) => (
                  <ListItem key={appointment.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {appointment.patientName.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={appointment.patientName}
                      secondary={`${appointment.time} - ${appointment.therapy} (${appointment.duration}min)`}
                    />
                    <Chip 
                      label={appointment.status} 
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
                {todayAppointments.length === 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                    No sessions scheduled for today
                  </Typography>
                )}
              </List>
            </Card>
          </Grid>

          {/* Patient Overview */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <People sx={{ mr: 1 }} />
                Recent Patients
              </Typography>
              <List>
                {patients.slice(0, 5).map((patient) => (
                  <ListItem key={patient.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {patient.name.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={patient.name}
                      secondary={`Age: ${patient.age} - ${patient.medicalHistory.slice(0, 2).join(', ')}`}
                    />
                    <Chip 
                      label={`${patient.totalVisits} visits`} 
                      color="info"
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>

        {/* Weekly Calendar */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Schedule sx={{ mr: 1 }} />
              Weekly Schedule
            </Typography>
            <WeekCalendar />
          </Card>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Button variant="outlined" startIcon={<PersonAdd />} fullWidth>
                  Add New Patient
                </Button>
                <Button variant="outlined" startIcon={<Schedule />} fullWidth>
                  Schedule Session
                </Button>
                <Button variant="outlined" startIcon={<LocalHospital />} fullWidth>
                  Update Treatment Plan
                </Button>
                <Button variant="outlined" startIcon={<PendingActions />} fullWidth>
                  Review Pending Cases
                </Button>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance Metrics
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Patient Satisfaction</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>96%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={96} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Session Completion</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>94%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={94} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Treatment Success</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>89%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={89} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Doctor Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<Schedule />}>
            Schedule New Session
          </Button>
          <Button variant="outlined" startIcon={<PersonAdd />}>
            Add Patient
          </Button>
          <Button variant="outlined" startIcon={<LocalHospital />}>
            Update Treatment Plans
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
