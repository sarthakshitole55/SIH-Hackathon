import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Search,
  CalendarToday,
  AccessTime,
  Person,
  LocalHospital,
  CheckCircle,
  Cancel,
  Edit,
  Delete,
  Add,
  FilterList,
  Refresh,
  Schedule,
  Event,
  Room
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function DoctorAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTab, setSelectedTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [statistics, setStatistics] = useState({
    appointmentStats: {},
    therapyStats: {},
    timeStats: {},
    performanceStats: {}
  })

  useEffect(() => {
    fetchAppointmentsData()
  }, [])

  const fetchAppointmentsData = async () => {
    try {
      const appointmentsRes = await api.get('/appointments')
      
      // Filter appointments for current doctor
      const doctorAppointments = appointmentsRes.data.appointments?.filter(apt => 
        apt.doctorName === 'Dr. Rajesh Kumar' || apt.doctorName === 'Dr. Sunita Reddy'
      ) || []

      setAppointments(doctorAppointments)

      // Calculate comprehensive statistics
      const stats = calculateAppointmentStatistics(doctorAppointments)
      setStatistics(stats)
    } catch (error) {
      console.error('Error fetching appointments data:', error)
      // Fallback data
      const fallbackAppointments = [
        {
          id: 'A001',
          patientName: 'Priya Sharma',
          patientId: 'P001',
          doctorName: 'Dr. Rajesh Kumar',
          therapy: 'Abhyanga',
          date: '2024-01-20',
          time: '09:00 AM',
          duration: 60,
          status: 'scheduled',
          room: 'Room 1',
          notes: 'Regular session for chronic back pain',
          phone: '+91 98765 43210',
          age: 35,
          gender: 'Female'
        },
        {
          id: 'A002',
          patientName: 'Raj Patel',
          patientId: 'P002',
          doctorName: 'Dr. Rajesh Kumar',
          therapy: 'Shirodhara',
          date: '2024-01-20',
          time: '11:00 AM',
          duration: 45,
          status: 'scheduled',
          room: 'Room 2',
          notes: 'Stress relief therapy session',
          phone: '+91 87654 32109',
          age: 42,
          gender: 'Male'
        },
        {
          id: 'A003',
          patientName: 'Sita Devi',
          patientId: 'P003',
          doctorName: 'Dr. Sunita Reddy',
          therapy: 'Panchakarma',
          date: '2024-01-19',
          time: '02:00 PM',
          duration: 90,
          status: 'completed',
          room: 'Room 3',
          notes: 'Completed detoxification session',
          phone: '+91 76543 21098',
          age: 28,
          gender: 'Female'
        },
        {
          id: 'A004',
          patientName: 'Vikram Singh',
          patientId: 'P004',
          doctorName: 'Dr. Sunita Reddy',
          therapy: 'Udvartana',
          date: '2024-01-18',
          time: '04:00 PM',
          duration: 45,
          status: 'completed',
          room: 'Room 1',
          notes: 'Joint pain relief therapy',
          phone: '+91 65432 10987',
          age: 50,
          gender: 'Male'
        },
        {
          id: 'A005',
          patientName: 'Anita Reddy',
          patientId: 'P005',
          doctorName: 'Dr. Rajesh Kumar',
          therapy: 'Abhyanga',
          date: '2024-01-17',
          time: '10:00 AM',
          duration: 60,
          status: 'cancelled',
          room: 'Room 2',
          notes: 'Patient cancelled due to illness',
          phone: '+91 54321 09876',
          age: 38,
          gender: 'Female'
        },
        {
          id: 'A006',
          patientName: 'Kumar Sharma',
          patientId: 'P006',
          doctorName: 'Dr. Sunita Reddy',
          therapy: 'Shirodhara',
          date: '2024-01-21',
          time: '03:00 PM',
          duration: 45,
          status: 'scheduled',
          room: 'Room 3',
          notes: 'First session for anxiety management',
          phone: '+91 43210 98765',
          age: 45,
          gender: 'Male'
        }
      ]
      setAppointments(fallbackAppointments)
    } finally {
      setLoading(false)
    }
  }

  const calculateAppointmentStatistics = (appointments) => {
    // Appointment Statistics
    const totalAppointments = appointments.length
    const statusCounts = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1
      return acc
    }, {})
    
    const completionRate = totalAppointments > 0 ? (statusCounts.completed / totalAppointments) * 100 : 0
    const cancellationRate = totalAppointments > 0 ? (statusCounts.cancelled / totalAppointments) * 100 : 0
    
    // Therapy Statistics
    const therapyCounts = {}
    const therapyRevenue = {}
    const revenuePerTherapy = {
      'Abhyanga': 2500,
      'Shirodhara': 1800,
      'Panchakarma': 3500,
      'Udvartana': 1200,
      'Steam Therapy': 800
    }
    
    appointments.forEach(apt => {
      therapyCounts[apt.therapy] = (therapyCounts[apt.therapy] || 0) + 1
      if (apt.status === 'completed') {
        therapyRevenue[apt.therapy] = (therapyRevenue[apt.therapy] || 0) + (revenuePerTherapy[apt.therapy] || 1500)
      }
    })
    
    const topTherapies = Object.entries(therapyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
    
    const totalRevenue = Object.values(therapyRevenue).reduce((sum, rev) => sum + rev, 0)
    
    // Time Statistics
    const timeSlots = {}
    const dayOfWeek = {}
    const monthlyStats = {}
    
    appointments.forEach(apt => {
      // Time slot analysis
      const timeSlot = apt.time?.split(':')[0] + ':00'
      timeSlots[timeSlot] = (timeSlots[timeSlot] || 0) + 1
      
      // Day of week analysis
      const day = new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long' })
      dayOfWeek[day] = (dayOfWeek[day] || 0) + 1
      
      // Monthly analysis
      const month = new Date(apt.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      monthlyStats[month] = (monthlyStats[month] || 0) + 1
    })
    
    const busiestTimeSlot = Object.entries(timeSlots).sort(([,a], [,b]) => b - a)[0]
    const busiestDay = Object.entries(dayOfWeek).sort(([,a], [,b]) => b - a)[0]
    
    // Performance Statistics
    const patientCounts = {}
    const averageDuration = appointments.reduce((sum, apt) => sum + (apt.duration || 60), 0) / totalAppointments
    
    appointments.forEach(apt => {
      patientCounts[apt.patientName] = (patientCounts[apt.patientName] || 0) + 1
    })
    
    const uniquePatients = Object.keys(patientCounts).length
    const averageAppointmentsPerPatient = uniquePatients > 0 ? totalAppointments / uniquePatients : 0
    
    // Efficiency metrics
    const onTimeRate = appointments.filter(apt => apt.status === 'completed').length / totalAppointments * 100
    const noShowRate = appointments.filter(apt => apt.status === 'cancelled').length / totalAppointments * 100
    
    return {
      appointmentStats: {
        totalAppointments,
        statusCounts,
        completionRate,
        cancellationRate,
        uniquePatients,
        averageAppointmentsPerPatient
      },
      therapyStats: {
        therapyCounts,
        topTherapies,
        therapyRevenue,
        totalRevenue,
        averageRevenuePerSession: totalRevenue / (statusCounts.completed || 1)
      },
      timeStats: {
        timeSlots,
        dayOfWeek,
        monthlyStats,
        busiestTimeSlot,
        busiestDay,
        averageDuration
      },
      performanceStats: {
        onTimeRate,
        noShowRate,
        efficiencyScore: (completionRate * 0.4) + ((100 - noShowRate) * 0.3) + (Math.min(100, (totalRevenue / 50000) * 100) * 0.3),
        patientRetentionRate: uniquePatients > 0 ? (Object.values(patientCounts).filter(count => count > 1).length / uniquePatients) * 100 : 0
      }
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.therapy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      case 'scheduled': return 'primary'
      case 'in-progress': return 'warning'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />
      case 'cancelled': return <Cancel />
      case 'scheduled': return <Schedule />
      case 'in-progress': return <AccessTime />
      default: return <Event />
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status: newStatus })
      fetchAppointmentsData()
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setOpenDialog(true)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AyurSidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Loading appointments...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AyurSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Appointments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and track all your patient appointments
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAppointmentsData}
          >
            Refresh
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Appointments</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {statistics.appointmentStats.totalAppointments || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {statistics.appointmentStats.uniquePatients || 0} unique patients
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
                  {statistics.appointmentStats.completionRate?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {statistics.appointmentStats.statusCounts?.completed || 0} completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Event color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Revenue</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  ₹{statistics.therapyStats.totalRevenue?.toLocaleString() || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg: ₹{statistics.therapyStats.averageRevenuePerSession?.toLocaleString() || 0}/session
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Efficiency Score</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {statistics.performanceStats.efficiencyScore?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Performance rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Top Therapies by Sessions
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
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip label={`${count} sessions`} size="small" color="primary" variant="outlined" />
                              <Chip 
                                label={`₹${statistics.therapyStats.therapyRevenue?.[therapy]?.toLocaleString() || 0}`} 
                                size="small" 
                                color="success" 
                                variant="outlined" 
                              />
                            </Box>
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
                  Appointment Distribution
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Status Breakdown</Typography>
                  {Object.entries(statistics.appointmentStats.statusCounts || {}).map(([status, count]) => (
                    <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{status}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{count}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Busiest Time</Typography>
                  <Typography variant="body2">
                    {statistics.timeStats.busiestTimeSlot?.[0] || 'N/A'} ({statistics.timeStats.busiestTimeSlot?.[1] || 0} appointments)
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Busiest Day</Typography>
                  <Typography variant="body2">
                    {statistics.timeStats.busiestDay?.[0] || 'N/A'} ({statistics.timeStats.busiestDay?.[1] || 0} appointments)
                  </Typography>
                </Box>
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
                  Appointment Status Distribution
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Simple Pie Chart representation using horizontal bars */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                    {Object.entries(statistics.appointmentStats.statusCounts || {}).map(([status, count], index) => {
                      const colors = ['success.main', 'primary.main', 'error.main', 'warning.main']
                      const percentage = (count / statistics.appointmentStats.totalAppointments) * 100
                      return (
                        <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box 
                            sx={{ 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: colors[index % colors.length],
                              borderRadius: '50%'
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: '80px', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                            {status}
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
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Time Slot Distribution
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Bar Chart for Time Slots */}
                  <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 1, p: 2 }}>
                    {Object.entries(statistics.timeStats.timeSlots || {}).slice(0, 5).map(([timeSlot, count], index) => {
                      const colors = ['primary.main', 'success.main', 'warning.main', 'info.main', 'error.main']
                      const maxCount = Math.max(...Object.values(statistics.timeStats.timeSlots || {}))
                      const height = maxCount > 0 ? (count / maxCount) * 120 : 20
                      return (
                        <Box key={timeSlot} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <Typography variant="caption" sx={{ mb: 1, fontSize: '0.7rem' }}>{timeSlot}</Typography>
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

        {/* Performance Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Performance Metrics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Completion Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {statistics.appointmentStats.completionRate?.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={statistics.appointmentStats.completionRate || 0} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Patient Retention</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {statistics.performanceStats.patientRetentionRate?.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={statistics.performanceStats.patientRetentionRate || 0} 
                    color="primary"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Efficiency Score</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {statistics.performanceStats.efficiencyScore?.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={statistics.performanceStats.efficiencyScore || 0} 
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
                  Revenue vs Performance Chart
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Simple bar chart for revenue comparison */}
                  <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ mb: 1 }}>Current Revenue</Typography>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: 'success.main', 
                          borderRadius: '4px 4px 0 0',
                          height: `${Math.max(20, (statistics.therapyStats.totalRevenue || 0) / 1000)}px`,
                          minHeight: '20px',
                          maxHeight: '120px'
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                        ₹{(statistics.therapyStats.totalRevenue || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ mb: 1 }}>Target</Typography>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: 'grey.300', 
                          borderRadius: '4px 4px 0 0',
                          height: '100px'
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                        ₹75,000
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ mb: 1 }}>Efficiency</Typography>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: 'primary.main', 
                          borderRadius: '4px 4px 0 0',
                          height: `${Math.max(20, (statistics.performanceStats.efficiencyScore || 0))}px`,
                          minHeight: '20px',
                          maxHeight: '120px'
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                        {statistics.performanceStats.efficiencyScore?.toFixed(1) || 0}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Appointment Analytics Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Appointment Analytics Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="primary.contrastText">
                        {statistics.timeStats.averageDuration?.toFixed(0) || 0}
                      </Typography>
                      <Typography variant="body2" color="primary.contrastText">
                        Avg Duration (min)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="success.contrastText">
                        {statistics.appointmentStats.averageAppointmentsPerPatient?.toFixed(1) || 0}
                      </Typography>
                      <Typography variant="body2" color="success.contrastText">
                        Avg Sessions/Patient
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="warning.contrastText">
                        {statistics.performanceStats.noShowRate?.toFixed(1) || 0}%
                      </Typography>
                      <Typography variant="body2" color="warning.contrastText">
                        No-Show Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="info.contrastText">
                        {statistics.performanceStats.onTimeRate?.toFixed(1) || 0}%
                      </Typography>
                      <Typography variant="body2" color="info.contrastText">
                        On-Time Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search appointments by patient or therapy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="all">All Appointments</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                sx={{ height: '56px' }}
              >
                Book New Appointment
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            sx={{ px: 2 }}
          >
            <Tab label="Today's Appointments" />
            <Tab label="This Week" />
            <Tab label="All Appointments" />
          </Tabs>
        </Paper>

        {/* Appointments List */}
        <Paper>
          <List>
            {filteredAppointments.map((appointment, index) => (
              <React.Fragment key={appointment.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: getStatusColor(appointment.status) + '.main',
                        width: 56,
                        height: 56
                      }}
                    >
                      {getInitials(appointment.patientName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {appointment.patientName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            icon={getStatusIcon(appointment.status)}
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
                              onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                          {appointment.status === 'scheduled' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <LocalHospital sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {appointment.therapy}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {new Date(appointment.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {appointment.time} ({appointment.duration} minutes)
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Room sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {appointment.room}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {appointment.age} years, {appointment.gender}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {appointment.notes}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleViewDetails(appointment)}
                              >
                                View Details
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Edit />}
                              >
                                Edit
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredAppointments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {filteredAppointments.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No appointments found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria or book a new appointment.
            </Typography>
          </Paper>
        )}

        {/* Appointment Details Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Appointment Details
          </DialogTitle>
          <DialogContent>
            {selectedAppointment && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Patient Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Name:</strong> {selectedAppointment.patientName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Age:</strong> {selectedAppointment.age} years
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Gender:</strong> {selectedAppointment.gender}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Phone:</strong> {selectedAppointment.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Appointment Details
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Therapy:</strong> {selectedAppointment.therapy}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Time:</strong> {selectedAppointment.time}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Duration:</strong> {selectedAppointment.duration} minutes
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Room:</strong> {selectedAppointment.room}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Status:</strong> 
                      <Chip
                        label={selectedAppointment.status}
                        size="small"
                        color={getStatusColor(selectedAppointment.status)}
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body2">
                      {selectedAppointment.notes}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button variant="contained">Edit Appointment</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
