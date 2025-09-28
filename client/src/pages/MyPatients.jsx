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
  Divider
} from '@mui/material'
import {
  Search,
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  HealthAndSafety,
  Edit,
  Visibility,
  Add,
  FilterList,
  TrendingUp,
  AccessTime
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function MyPatients() {
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTab, setSelectedTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    demographicStats: {},
    conditionStats: {},
    treatmentStats: {},
    engagementStats: {}
  })

  useEffect(() => {
    fetchPatientsData()
  }, [])

  const fetchPatientsData = async () => {
    try {
      const [patientsRes, appointmentsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/appointments')
      ])

      // Filter patients for current doctor
      const doctorPatients = patientsRes.data.patients?.filter(patient => 
        patient.doctor === 'Dr. Rajesh Kumar' || patient.doctor === 'Dr. Sunita Reddy'
      ) || []

      // Filter appointments for current doctor
      const doctorAppointments = appointmentsRes.data.appointments?.filter(apt => 
        apt.doctorName === 'Dr. Rajesh Kumar' || apt.doctorName === 'Dr. Sunita Reddy'
      ) || []

      // Enhance patients with appointment data
      const enhancedPatients = doctorPatients.map(patient => {
        const patientAppointments = doctorAppointments.filter(apt => 
          apt.patientName === patient.name
        )
        
        const lastAppointment = patientAppointments
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        
        const upcomingAppointment = patientAppointments
          .filter(apt => apt.status === 'scheduled')
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0]

        return {
          ...patient,
          totalAppointments: patientAppointments.length,
          lastAppointment,
          upcomingAppointment,
          status: lastAppointment?.status === 'completed' ? 'active' : 'new'
        }
      })

      setPatients(enhancedPatients)
      setAppointments(doctorAppointments)

      // Calculate comprehensive statistics
      const stats = calculatePatientStatistics(enhancedPatients, doctorAppointments)
      setStatistics(stats)
    } catch (error) {
      console.error('Error fetching patients data:', error)
      // Fallback data
      const fallbackPatients = [
        {
          id: 'P001',
          name: 'Priya Sharma',
          age: 35,
          gender: 'Female',
          phone: '+91 98765 43210',
          email: 'priya.sharma@email.com',
          address: '123 MG Road, Bangalore',
          condition: 'Chronic Back Pain',
          doctor: 'Dr. Rajesh Kumar',
          totalAppointments: 8,
          status: 'active',
          lastAppointment: {
            date: '2024-01-15',
            therapy: 'Abhyanga',
            status: 'completed'
          },
          upcomingAppointment: {
            date: '2024-01-20',
            therapy: 'Shirodhara',
            time: '10:00 AM'
          }
        },
        {
          id: 'P002',
          name: 'Raj Patel',
          age: 42,
          gender: 'Male',
          phone: '+91 87654 32109',
          email: 'raj.patel@email.com',
          address: '456 Brigade Road, Bangalore',
          condition: 'Stress & Anxiety',
          doctor: 'Dr. Rajesh Kumar',
          totalAppointments: 5,
          status: 'active',
          lastAppointment: {
            date: '2024-01-14',
            therapy: 'Shirodhara',
            status: 'completed'
          },
          upcomingAppointment: {
            date: '2024-01-18',
            therapy: 'Panchakarma',
            time: '02:00 PM'
          }
        },
        {
          id: 'P003',
          name: 'Sita Devi',
          age: 28,
          gender: 'Female',
          phone: '+91 76543 21098',
          email: 'sita.devi@email.com',
          address: '789 Koramangala, Bangalore',
          condition: 'Digestive Issues',
          doctor: 'Dr. Sunita Reddy',
          totalAppointments: 3,
          status: 'new',
          lastAppointment: {
            date: '2024-01-13',
            therapy: 'Panchakarma',
            status: 'completed'
          },
          upcomingAppointment: {
            date: '2024-01-19',
            therapy: 'Udvartana',
            time: '11:00 AM'
          }
        },
        {
          id: 'P004',
          name: 'Vikram Singh',
          age: 50,
          gender: 'Male',
          phone: '+91 65432 10987',
          email: 'vikram.singh@email.com',
          address: '321 Indiranagar, Bangalore',
          condition: 'Joint Pain',
          doctor: 'Dr. Sunita Reddy',
          totalAppointments: 12,
          status: 'active',
          lastAppointment: {
            date: '2024-01-12',
            therapy: 'Udvartana',
            status: 'completed'
          },
          upcomingAppointment: {
            date: '2024-01-17',
            therapy: 'Abhyanga',
            time: '03:00 PM'
          }
        }
      ]
      setPatients(fallbackPatients)
    } finally {
      setLoading(false)
    }
  }

  const calculatePatientStatistics = (patients, appointments) => {
    // Demographic Statistics
    const genderCounts = {}
    const ageGroups = { '18-30': 0, '31-45': 0, '46-60': 0, '60+': 0 }
    
    patients.forEach(patient => {
      // Gender distribution
      genderCounts[patient.gender] = (genderCounts[patient.gender] || 0) + 1
      
      // Age groups
      if (patient.age <= 30) ageGroups['18-30']++
      else if (patient.age <= 45) ageGroups['31-45']++
      else if (patient.age <= 60) ageGroups['46-60']++
      else ageGroups['60+']++
    })

    // Condition Statistics
    const conditionCounts = {}
    const conditionSeverity = {}
    
    patients.forEach(patient => {
      conditionCounts[patient.condition] = (conditionCounts[patient.condition] || 0) + 1
      
      // Determine severity based on appointment frequency
      const patientAppointments = appointments.filter(apt => apt.patientName === patient.name)
      const severity = patientAppointments.length > 10 ? 'High' : 
                      patientAppointments.length > 5 ? 'Medium' : 'Low'
      conditionSeverity[patient.condition] = conditionSeverity[patient.condition] || { High: 0, Medium: 0, Low: 0 }
      conditionSeverity[patient.condition][severity]++
    })

    // Treatment Statistics
    const totalAppointments = appointments.length
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length
    const averageSessionsPerPatient = patients.length > 0 ? totalAppointments / patients.length : 0
    const treatmentDuration = {}
    
    patients.forEach(patient => {
      const patientAppointments = appointments.filter(apt => apt.patientName === patient.name)
      if (patientAppointments.length > 0) {
        const firstAppointment = patientAppointments.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
        const lastAppointment = patientAppointments.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        const duration = Math.ceil((new Date(lastAppointment.date) - new Date(firstAppointment.date)) / (1000 * 60 * 60 * 24 * 7)) // weeks
        treatmentDuration[patient.condition] = treatmentDuration[patient.condition] || []
        treatmentDuration[patient.condition].push(duration)
      }
    })

    // Engagement Statistics
    const statusCounts = { active: 0, new: 0, inactive: 0 }
    const appointmentFrequency = { weekly: 0, biweekly: 0, monthly: 0, irregular: 0 }
    
    patients.forEach(patient => {
      statusCounts[patient.status] = (statusCounts[patient.status] || 0) + 1
      
      const patientAppointments = appointments.filter(apt => apt.patientName === patient.name)
      if (patientAppointments.length > 1) {
        const avgDaysBetween = patientAppointments.length > 1 ? 
          (new Date(patientAppointments[patientAppointments.length - 1].date) - new Date(patientAppointments[0].date)) / 
          (1000 * 60 * 60 * 24 * (patientAppointments.length - 1)) : 0
        
        if (avgDaysBetween <= 7) appointmentFrequency.weekly++
        else if (avgDaysBetween <= 14) appointmentFrequency.biweekly++
        else if (avgDaysBetween <= 30) appointmentFrequency.monthly++
        else appointmentFrequency.irregular++
      }
    })

    // Calculate average treatment duration per condition
    Object.keys(treatmentDuration).forEach(condition => {
      const durations = treatmentDuration[condition]
      treatmentDuration[condition] = durations.reduce((sum, dur) => sum + dur, 0) / durations.length
    })

    return {
      demographicStats: {
        totalPatients: patients.length,
        genderCounts,
        ageGroups,
        averageAge: patients.reduce((sum, p) => sum + p.age, 0) / patients.length
      },
      conditionStats: {
        conditionCounts,
        conditionSeverity,
        topConditions: Object.entries(conditionCounts).sort(([,a], [,b]) => b - a).slice(0, 5),
        totalConditions: Object.keys(conditionCounts).length
      },
      treatmentStats: {
        totalAppointments,
        completedAppointments,
        averageSessionsPerPatient,
        treatmentDuration,
        completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0
      },
      engagementStats: {
        statusCounts,
        appointmentFrequency,
        activePatientRate: patients.length > 0 ? (statusCounts.active / patients.length) * 100 : 0,
        averageTreatmentDuration: Object.values(treatmentDuration).reduce((sum, dur) => sum + dur, 0) / Object.keys(treatmentDuration).length || 0
      }
    }
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'new': return 'primary'
      case 'inactive': return 'default'
      default: return 'default'
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AyurSidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Loading patients...</Typography>
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
            My Patients
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your patient information and treatment progress
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Patients</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {statistics.demographicStats.totalPatients || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg age: {statistics.demographicStats.averageAge?.toFixed(1) || 0} years
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Rate</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {statistics.engagementStats.activePatientRate?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {statistics.engagementStats.statusCounts?.active || 0} active patients
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Sessions</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {statistics.treatmentStats.averageSessionsPerPatient?.toFixed(1) || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Per patient
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HealthAndSafety color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Completion Rate</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {statistics.treatmentStats.completionRate?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {statistics.treatmentStats.completedAppointments || 0} completed
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
                  Patient Demographics Distribution
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Bar Chart for Demographics */}
                  <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 2, p: 2 }}>
                    {Object.entries(statistics.demographicStats.genderCounts || {}).map(([gender, count], index) => {
                      const colors = ['primary.main', 'secondary.main']
                      const maxCount = Math.max(...Object.values(statistics.demographicStats.genderCounts || {}))
                      const height = maxCount > 0 ? (count / maxCount) * 120 : 20
                      return (
                        <Box key={gender} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <Typography variant="caption" sx={{ mb: 1, fontSize: '0.7rem' }}>{gender}</Typography>
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
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Condition Distribution
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Pie Chart representation using horizontal bars */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                    {statistics.conditionStats.topConditions?.map(([condition, count], index) => {
                      const colors = ['primary.main', 'success.main', 'warning.main', 'info.main', 'error.main']
                      const percentage = (count / statistics.demographicStats.totalPatients) * 100
                      return (
                        <Box key={condition} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box 
                            sx={{ 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: colors[index % colors.length],
                              borderRadius: '50%'
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: '120px', fontSize: '0.75rem' }}>
                            {condition}
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

        {/* Detailed Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Demographics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Gender Distribution</Typography>
                  {Object.entries(statistics.demographicStats.genderCounts || {}).map(([gender, count]) => (
                    <Box key={gender} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{gender}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{count}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Age Groups</Typography>
                  {Object.entries(statistics.demographicStats.ageGroups || {}).map(([ageGroup, count]) => (
                    <Box key={ageGroup} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{ageGroup}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{count}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Top Conditions
                </Typography>
                <List dense>
                  {statistics.conditionStats.topConditions?.map(([condition, count], index) => (
                    <ListItem key={condition} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {condition}
                            </Typography>
                            <Chip label={count} size="small" color="primary" variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Avg duration: {statistics.treatmentStats.treatmentDuration?.[condition]?.toFixed(1) || 0} weeks
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Engagement Patterns
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Appointment Frequency</Typography>
                  {Object.entries(statistics.engagementStats.appointmentFrequency || {}).map(([frequency, count]) => (
                    <Box key={frequency} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{frequency}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{count}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Patient Status</Typography>
                  {Object.entries(statistics.engagementStats.statusCounts || {}).map(([status, count]) => (
                    <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{status}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{count}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Treatment Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Treatment Analytics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="primary.contrastText">
                        {statistics.treatmentStats.totalAppointments || 0}
                      </Typography>
                      <Typography variant="body2" color="primary.contrastText">
                        Total Sessions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="success.contrastText">
                        {statistics.engagementStats.averageTreatmentDuration?.toFixed(1) || 0}
                      </Typography>
                      <Typography variant="body2" color="success.contrastText">
                        Avg Duration (weeks)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="warning.contrastText">
                        {statistics.conditionStats.totalConditions || 0}
                      </Typography>
                      <Typography variant="body2" color="warning.contrastText">
                        Unique Conditions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="info.contrastText">
                        {statistics.treatmentStats.completionRate?.toFixed(1) || 0}%
                      </Typography>
                      <Typography variant="body2" color="info.contrastText">
                        Success Rate
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
                placeholder="Search patients by name or condition..."
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
                  <MenuItem value="all">All Patients</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                sx={{ height: '56px' }}
              >
                Add New Patient
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
            <Tab label="All Patients" />
            <Tab label="Recent Appointments" />
            <Tab label="Treatment Plans" />
          </Tabs>
        </Paper>

        {/* Patients List */}
        <Grid container spacing={3}>
          {filteredPatients.map((patient) => (
            <Grid item xs={12} md={6} lg={4} key={patient.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.main',
                        mr: 2,
                        fontSize: '1.2rem',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(patient.name)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {patient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.age} years • {patient.gender}
                      </Typography>
                      <Chip
                        label={patient.status}
                        size="small"
                        color={getStatusColor(patient.status)}
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Phone sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {patient.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Email sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {patient.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {patient.address}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Medical Condition
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patient.condition}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Treatment History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patient.totalAppointments} sessions completed
                    </Typography>
                    {patient.lastAppointment && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Last: {patient.lastAppointment.therapy} on {patient.lastAppointment.date}
                      </Typography>
                    )}
                  </Box>

                  {patient.upcomingAppointment && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Next Appointment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.upcomingAppointment.therapy} on {patient.upcomingAppointment.date}
                      </Typography>
                      <Typography variant="caption" color="primary" display="block">
                        {patient.upcomingAppointment.time}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      sx={{ flexGrow: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      sx={{ flexGrow: 1 }}
                    >
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredPatients.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No patients found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria or add a new patient.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  )
}
