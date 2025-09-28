import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  Schedule,
  Person,
  AccessTime,
  Event,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  LocalHospital
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function MySchedule() {
  const { user } = useAuth()
  const [scheduleData, setScheduleData] = useState([])
  const [appointments, setAppointments] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    weeklyStats: {},
    therapyStats: {},
    patientStats: {},
    productivityStats: {}
  })

  useEffect(() => {
    fetchScheduleData()
  }, [])

  const fetchScheduleData = async () => {
    try {
      const [appointmentsRes, timeSlotsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/appointments/master-data')
      ])

      // Filter appointments for current doctor
      const doctorAppointments = appointmentsRes.data.appointments?.filter(apt => 
        apt.doctorName === 'Dr. Rajesh Kumar' || apt.doctorName === 'Dr. Sunita Reddy'
      ) || []

      // Get available time slots
      const availableSlots = timeSlotsRes.data.timeSlots || [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
      ]

      // Create schedule data for the next 7 days
      const schedule = []
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        
        const dayAppointments = doctorAppointments.filter(apt => 
          apt.date === dateStr
        )

        // Create time slots for the day
        const daySlots = availableSlots.map(time => {
          const appointment = dayAppointments.find(apt => apt.time === time)
          return {
            time,
            available: !appointment,
            appointment: appointment || null
          }
        })

        schedule.push({
          date: dateStr,
          dateObj: date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          slots: daySlots,
          totalAppointments: dayAppointments.length,
          completedAppointments: dayAppointments.filter(apt => apt.status === 'completed').length
        })
      }

      setScheduleData(schedule)
      setAppointments(doctorAppointments)
      setTimeSlots(availableSlots)

      // Calculate comprehensive statistics
      const stats = calculateStatistics(doctorAppointments, schedule)
      setStatistics(stats)
    } catch (error) {
      console.error('Error fetching schedule data:', error)
      // Fallback data
      const fallbackSchedule = [
        {
          date: new Date().toISOString().split('T')[0],
          dateObj: new Date(),
          dayName: 'Today',
          slots: [
            { time: '09:00 AM', available: false, appointment: { patientName: 'Priya Sharma', therapy: 'Abhyanga', status: 'scheduled' } },
            { time: '10:00 AM', available: true, appointment: null },
            { time: '11:00 AM', available: false, appointment: { patientName: 'Raj Patel', therapy: 'Shirodhara', status: 'scheduled' } },
            { time: '12:00 PM', available: true, appointment: null },
            { time: '02:00 PM', available: false, appointment: { patientName: 'Sita Devi', therapy: 'Panchakarma', status: 'completed' } },
            { time: '03:00 PM', available: true, appointment: null },
            { time: '04:00 PM', available: false, appointment: { patientName: 'Vikram Singh', therapy: 'Udvartana', status: 'scheduled' } },
            { time: '05:00 PM', available: true, appointment: null }
          ],
          totalAppointments: 4,
          completedAppointments: 1
        }
      ]
      setScheduleData(fallbackSchedule)
    } finally {
      setLoading(false)
    }
  }

  const calculateStatistics = (appointments, schedule) => {
    // Weekly Statistics
    const totalAppointments = appointments.length
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length
    const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled').length
    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0
    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0

    // Therapy Statistics
    const therapyCounts = {}
    appointments.forEach(apt => {
      therapyCounts[apt.therapy] = (therapyCounts[apt.therapy] || 0) + 1
    })
    const topTherapies = Object.entries(therapyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    // Patient Statistics
    const patientCounts = {}
    appointments.forEach(apt => {
      patientCounts[apt.patientName] = (patientCounts[apt.patientName] || 0) + 1
    })
    const topPatients = Object.entries(patientCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    // Productivity Statistics
    const weeklyHours = schedule.reduce((sum, day) => {
      const dayHours = day.slots.filter(slot => !slot.available).length * 1 // Assuming 1 hour per slot
      return sum + dayHours
    }, 0)
    const averageDailyAppointments = totalAppointments / 7
    const utilizationRate = schedule.reduce((sum, day) => {
      const totalSlots = day.slots.length
      const bookedSlots = day.slots.filter(slot => !slot.available).length
      return sum + (totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0)
    }, 0) / schedule.length

    // Revenue Statistics (estimated)
    const revenuePerTherapy = {
      'Abhyanga': 2500,
      'Shirodhara': 1800,
      'Panchakarma': 3500,
      'Udvartana': 1200,
      'Steam Therapy': 800
    }
    const estimatedRevenue = appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + (revenuePerTherapy[apt.therapy] || 1500), 0)

    return {
      weeklyStats: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        scheduledAppointments,
        completionRate,
        cancellationRate,
        averageDailyAppointments,
        utilizationRate,
        weeklyHours,
        estimatedRevenue
      },
      therapyStats: {
        topTherapies,
        therapyCounts,
        totalTherapies: Object.keys(therapyCounts).length
      },
      patientStats: {
        topPatients,
        patientCounts,
        totalPatients: Object.keys(patientCounts).length,
        averageAppointmentsPerPatient: Object.keys(patientCounts).length > 0 ? 
          totalAppointments / Object.keys(patientCounts).length : 0
      },
      productivityStats: {
        weeklyHours,
        averageDailyAppointments,
        utilizationRate,
        estimatedRevenue,
        efficiencyScore: (completionRate * 0.4) + (utilizationRate * 0.3) + (Math.min(100, (estimatedRevenue / 10000) * 100) * 0.3)
      }
    }
  }

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status })
      fetchScheduleData()
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      case 'scheduled': return 'primary'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />
      case 'cancelled': return <Cancel />
      case 'scheduled': return <Schedule />
      default: return <Event />
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AyurSidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Loading schedule...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AyurSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            My Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your daily appointments and availability
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Today's Appointments</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {scheduleData[0]?.totalAppointments || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg: {statistics.weeklyStats.averageDailyAppointments?.toFixed(1) || 0}/day
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Completion Rate</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {statistics.weeklyStats.completionRate?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {statistics.weeklyStats.completedAppointments || 0} completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Utilization</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {statistics.weeklyStats.utilizationRate?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {statistics.weeklyStats.weeklyHours || 0} hours/week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Event color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Estimated Revenue</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  ₹{statistics.weeklyStats.estimatedRevenue?.toLocaleString() || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  This week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Visual Analytics Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Weekly Appointment Distribution
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Bar Chart for Daily Appointments */}
                  <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 1, p: 2 }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const colors = ['primary.main', 'success.main', 'warning.main', 'info.main', 'error.main', 'secondary.main', 'grey.500']
                      const appointments = Math.floor(Math.random() * 8) + 1 // Mock data for demo
                      const height = (appointments / 10) * 120
                      return (
                        <Box key={day} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <Typography variant="caption" sx={{ mb: 1, fontSize: '0.7rem' }}>{day}</Typography>
                          <Box 
                            sx={{ 
                              width: '100%', 
                              backgroundColor: colors[index % colors.length], 
                              borderRadius: '4px 4px 0 0',
                              height: `${Math.max(20, height)}px`,
                              minHeight: '20px'
                            }}
                          />
                          <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                            {appointments}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Therapy Distribution
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Pie Chart representation using horizontal bars */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                    {statistics.therapyStats.topTherapies?.map(([therapy, count], index) => {
                      const colors = ['primary.main', 'success.main', 'warning.main', 'info.main', 'error.main']
                      const percentage = (count / statistics.weeklyStats.totalAppointments) * 100
                      return (
                        <Box key={therapy} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box 
                            sx={{ 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: colors[index % colors.length],
                              borderRadius: '50%'
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: '100px', fontSize: '0.75rem' }}>
                            {therapy}
                          </Typography>
                          <Box sx={{ flex: 1, height: '20px', backgroundColor: 'grey.200', borderRadius: '10px', overflow: 'hidden' }}>
                            <Box 
                              sx={{ 
                                width: `${percentage}%`, 
                                height: '100%', 
                                backgroundColor: colors[index % colors.length],
                                borderRadius: '10px',
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ minWidth: '40px', textAlign: 'right' }}>
                            {count}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Top Therapies This Week
                </Typography>
                <List dense>
                  {statistics.therapyStats.topTherapies?.map(([therapy, count], index) => (
                    <ListItem key={therapy} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {therapy}
                            </Typography>
                            <Chip label={`${count} sessions`} size="small" color="primary" variant="outlined" />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Most Active Patients
                </Typography>
                <List dense>
                  {statistics.patientStats.topPatients?.map(([patient, count], index) => (
                    <ListItem key={patient} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {patient}
                            </Typography>
                            <Chip label={`${count} visits`} size="small" color="secondary" variant="outlined" />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Productivity Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Weekly Performance
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Completion Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {statistics.weeklyStats.completionRate?.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={statistics.weeklyStats.completionRate || 0} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Schedule Utilization</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {statistics.weeklyStats.utilizationRate?.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={statistics.weeklyStats.utilizationRate || 0} 
                    color="primary"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Efficiency Score</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {statistics.productivityStats.efficiencyScore?.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={statistics.productivityStats.efficiencyScore || 0} 
                    color="info"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Weekly Statistics Summary
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">This Week</TableCell>
                        <TableCell align="right">Average</TableCell>
                        <TableCell align="right">Target</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Appointments</TableCell>
                        <TableCell align="right">{statistics.weeklyStats.totalAppointments || 0}</TableCell>
                        <TableCell align="right">{statistics.weeklyStats.averageDailyAppointments?.toFixed(1) || 0}/day</TableCell>
                        <TableCell align="right">35/week</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Completed Sessions</TableCell>
                        <TableCell align="right">{statistics.weeklyStats.completedAppointments || 0}</TableCell>
                        <TableCell align="right">{statistics.weeklyStats.completionRate?.toFixed(1) || 0}%</TableCell>
                        <TableCell align="right">90%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Working Hours</TableCell>
                        <TableCell align="right">{statistics.weeklyStats.weeklyHours || 0}h</TableCell>
                        <TableCell align="right">40h/week</TableCell>
                        <TableCell align="right">40h/week</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Revenue Generated</TableCell>
                        <TableCell align="right">₹{statistics.weeklyStats.estimatedRevenue?.toLocaleString() || 0}</TableCell>
                        <TableCell align="right">₹75,000</TableCell>
                        <TableCell align="right">₹1,00,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Unique Patients</TableCell>
                        <TableCell align="right">{statistics.patientStats.totalPatients || 0}</TableCell>
                        <TableCell align="right">{statistics.patientStats.averageAppointmentsPerPatient?.toFixed(1) || 0} visits</TableCell>
                        <TableCell align="right">25/week</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Schedule Grid */}
        <Grid container spacing={3}>
          {scheduleData.map((day, index) => (
            <Grid item xs={12} md={6} lg={4} key={day.date}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {index === 0 ? 'Today' : day.dayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {day.dateObj.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={`${day.totalAppointments} appointments`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <List dense>
                  {day.slots.slice(0, 6).map((slot, slotIndex) => (
                    <React.Fragment key={slotIndex}>
                      <ListItem 
                        sx={{ 
                          py: 0.5,
                          backgroundColor: slot.appointment ? 'action.hover' : 'transparent',
                          borderRadius: 1,
                          mb: 0.5
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              fontSize: '0.75rem',
                              bgcolor: slot.available ? 'success.main' : 'primary.main'
                            }}
                          >
                            {slot.time.split(':')[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {slot.time}
                              </Typography>
                              <Chip
                                label={slot.available ? 'Available' : 'Booked'}
                                size="small"
                                color={slot.available ? 'success' : 'primary'}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            slot.appointment && (
                              <Box>
                                <Typography variant="caption" display="block">
                                  {slot.appointment.patientName}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  {slot.appointment.therapy}
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                  <Chip
                                    icon={getStatusIcon(slot.appointment.status)}
                                    label={slot.appointment.status}
                                    size="small"
                                    color={getStatusColor(slot.appointment.status)}
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                            )
                          }
                        />
                      </ListItem>
                      {slotIndex < 5 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                {day.slots.length > 6 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    +{day.slots.length - 6} more slots
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Upcoming Appointments */}
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Upcoming Appointments
          </Typography>
          <List>
            {appointments.slice(0, 5).map((appointment, index) => (
              <React.Fragment key={appointment.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <LocalHospital />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {appointment.patientName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={getStatusColor(appointment.status)}
                            variant="outlined"
                          />
                          {appointment.status === 'scheduled' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.therapy} • {appointment.date} at {appointment.time}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Room: {appointment.room || 'Room 1'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < 4 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  )
}
