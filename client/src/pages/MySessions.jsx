import React, { useEffect, useState } from 'react'
import { 
  Box, Grid, Card, Typography, Button, List, ListItem, ListItemText, 
  ListItemIcon, Avatar, Chip, Stack, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { 
  CalendarToday, AccessTime, LocalHospital, Person, 
  CheckCircle, Cancel, Edit, Add, FilterList
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function MySessions() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsRes = await api.get('/appointments')
        
        // Filter for current patient
        const patientAppointments = appointmentsRes.data.appointments?.filter(apt => 
          apt.patientId === 'P001' || apt.patientName === 'Priya Sharma'
        ) || []

        setAppointments(patientAppointments)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        // Fallback data
        setAppointments([
          {
            id: '1',
            patientName: 'Priya Sharma',
            therapy: 'Abhyanga',
            date: '2024-12-25',
            time: '09:00',
            doctorName: 'Dr. Rajesh Kumar',
            status: 'confirmed',
            duration: 60,
            room: 'Therapy Room 1',
            notes: 'First session - stress relief'
          },
          {
            id: '2',
            patientName: 'Priya Sharma',
            therapy: 'Shirodhara',
            date: '2024-12-27',
            time: '14:00',
            doctorName: 'Dr. Rajesh Kumar',
            status: 'scheduled',
            duration: 45,
            room: 'Therapy Room 2',
            notes: 'Migraine treatment'
          },
          {
            id: '3',
            patientName: 'Priya Sharma',
            therapy: 'Abhyanga',
            date: '2024-12-20',
            time: '10:00',
            doctorName: 'Dr. Rajesh Kumar',
            status: 'completed',
            duration: 60,
            room: 'Therapy Room 1',
            notes: 'Completed session'
          },
          {
            id: '4',
            patientName: 'Priya Sharma',
            therapy: 'Panchakarma',
            date: '2024-12-30',
            time: '11:30',
            doctorName: 'Dr. Sunita Reddy',
            status: 'scheduled',
            duration: 120,
            room: 'Panchakarma Suite A',
            notes: 'Detoxification program'
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'scheduled': return 'info'
      case 'in-progress': return 'warning'
      case 'completed': return 'default'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />
      case 'scheduled': return <CalendarToday />
      case 'in-progress': return <AccessTime />
      case 'completed': return <CheckCircle />
      case 'cancelled': return <Cancel />
      default: return <CalendarToday />
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return new Date(apt.date) >= new Date() && apt.status !== 'completed'
    if (filter === 'completed') return apt.status === 'completed'
    if (filter === 'cancelled') return apt.status === 'cancelled'
    return true
  })

  const upcomingCount = appointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status !== 'completed'
  ).length

  const completedCount = appointments.filter(apt => apt.status === 'completed').length

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
        <AyurSidebar />
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Loading your sessions...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
      <AyurSidebar />
      <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
            My Sessions
          </Typography>
          <Button variant="contained" startIcon={<Add />}>
            Book New Session
          </Button>
        </Box>

        {/* Session Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                {upcomingCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Upcoming Sessions
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                {completedCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Completed Sessions
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                {appointments.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Sessions
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Options */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="All Sessions" 
            onClick={() => setFilter('all')} 
            color={filter === 'all' ? 'primary' : 'default'}
            icon={<FilterList />}
          />
          <Chip 
            label="Upcoming" 
            onClick={() => setFilter('upcoming')} 
            color={filter === 'upcoming' ? 'primary' : 'default'}
            icon={<CalendarToday />}
          />
          <Chip 
            label="Completed" 
            onClick={() => setFilter('completed')} 
            color={filter === 'completed' ? 'primary' : 'default'}
            icon={<CheckCircle />}
          />
          <Chip 
            label="Cancelled" 
            onClick={() => setFilter('cancelled')} 
            color={filter === 'cancelled' ? 'primary' : 'default'}
            icon={<Cancel />}
          />
        </Box>

        {/* Sessions List */}
        <Card sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {filter === 'all' ? 'All Sessions' : 
               filter === 'upcoming' ? 'Upcoming Sessions' :
               filter === 'completed' ? 'Completed Sessions' : 'Cancelled Sessions'}
            </Typography>
            <List>
              {filteredAppointments.map((appointment) => (
                <ListItem 
                  key={appointment.id} 
                  sx={{ 
                    px: 0, 
                    py: 2, 
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ 
                      bgcolor: appointment.status === 'completed' ? 'success.main' : 
                               appointment.status === 'confirmed' ? 'primary.main' : 'warning.main',
                      width: 48, 
                      height: 48 
                    }}>
                      {getStatusIcon(appointment.status)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {appointment.therapy}
                        </Typography>
                        <Chip 
                          label={appointment.status} 
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Date:</strong> {appointment.date} at {appointment.time}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Doctor:</strong> {appointment.doctorName}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Duration:</strong> {appointment.duration} minutes
                        </Typography>
                        <Typography variant="body2">
                          <strong>Room:</strong> {appointment.room}
                        </Typography>
                        {appointment.notes && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            <strong>Notes:</strong> {appointment.notes}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setSelectedAppointment(appointment)
                        setDetailsOpen(true)
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
              {filteredAppointments.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    No sessions found for the selected filter.
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </Card>

        {/* Session Details Dialog */}
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Session Details</DialogTitle>
          <DialogContent>
            {selectedAppointment && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Therapy
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {selectedAppointment.therapy}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Status
                    </Typography>
                    <Chip 
                      label={selectedAppointment.status} 
                      color={getStatusColor(selectedAppointment.status)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Date & Time
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedAppointment.date} at {selectedAppointment.time}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Duration
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedAppointment.duration} minutes
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Doctor
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedAppointment.doctorName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Room
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedAppointment.room}
                    </Typography>
                  </Grid>
                  {selectedAppointment.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Notes
                      </Typography>
                      <Typography variant="body1">
                        {selectedAppointment.notes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            {selectedAppointment?.status === 'scheduled' && (
              <Button variant="contained">Reschedule</Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
