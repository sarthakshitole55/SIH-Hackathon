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
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import {
  Search,
  Person,
  HealthAndSafety,
  Schedule,
  Add,
  Edit,
  Delete,
  Visibility,
  ExpandMore,
  CheckCircle,
  AccessTime,
  Warning,
  TrendingUp,
  CalendarToday,
  LocalHospital
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function TreatmentPlans() {
  const { user } = useAuth()
  const [treatmentPlans, setTreatmentPlans] = useState([])
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTab, setSelectedTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [statistics, setStatistics] = useState({
    planStats: {},
    conditionStats: {},
    progressStats: {},
    outcomeStats: {}
  })

  useEffect(() => {
    fetchTreatmentPlansData()
  }, [])

  const fetchTreatmentPlansData = async () => {
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

      // Create treatment plans based on patient data
      const plans = doctorPatients.map(patient => {
        const patientAppointments = doctorAppointments.filter(apt => 
          apt.patientName === patient.name
        )
        
        const completedSessions = patientAppointments.filter(apt => apt.status === 'completed').length
        const totalSessions = patientAppointments.length
        const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

        // Determine treatment plan based on condition
        let planDetails = []
        let duration = 0
        
        switch (patient.condition?.toLowerCase()) {
          case 'chronic back pain':
            planDetails = [
              { therapy: 'Abhyanga', frequency: '3x per week', duration: 60, sessions: 12 },
              { therapy: 'Shirodhara', frequency: '2x per week', duration: 45, sessions: 8 },
              { therapy: 'Udvartana', frequency: '1x per week', duration: 45, sessions: 6 }
            ]
            duration = 8
            break
          case 'stress & anxiety':
            planDetails = [
              { therapy: 'Shirodhara', frequency: '3x per week', duration: 45, sessions: 15 },
              { therapy: 'Abhyanga', frequency: '2x per week', duration: 60, sessions: 10 },
              { therapy: 'Meditation', frequency: 'Daily', duration: 30, sessions: 30 }
            ]
            duration = 10
            break
          case 'digestive issues':
            planDetails = [
              { therapy: 'Panchakarma', frequency: '2x per week', duration: 90, sessions: 8 },
              { therapy: 'Abhyanga', frequency: '2x per week', duration: 60, sessions: 8 },
              { therapy: 'Diet Consultation', frequency: '1x per week', duration: 30, sessions: 4 }
            ]
            duration = 6
            break
          case 'joint pain':
            planDetails = [
              { therapy: 'Udvartana', frequency: '3x per week', duration: 45, sessions: 12 },
              { therapy: 'Abhyanga', frequency: '2x per week', duration: 60, sessions: 8 },
              { therapy: 'Steam Therapy', frequency: '2x per week', duration: 30, sessions: 8 }
            ]
            duration = 8
            break
          default:
            planDetails = [
              { therapy: 'Abhyanga', frequency: '2x per week', duration: 60, sessions: 8 },
              { therapy: 'Consultation', frequency: '1x per week', duration: 30, sessions: 4 }
            ]
            duration = 6
        }

        const status = progress === 100 ? 'completed' : 
                      progress > 0 ? 'in-progress' : 'not-started'

        return {
          id: `TP${patient.id}`,
          patientId: patient.id,
          patientName: patient.name,
          patientAge: patient.age,
          patientGender: patient.gender,
          condition: patient.condition,
          doctor: patient.doctor,
          planDetails,
          duration,
          totalSessions,
          completedSessions,
          progress,
          status,
          startDate: patientAppointments.length > 0 ? 
            patientAppointments.sort((a, b) => new Date(a.date) - new Date(b.date))[0].date : 
            new Date().toISOString().split('T')[0],
          nextSession: patientAppointments
            .filter(apt => apt.status === 'scheduled')
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null,
          notes: `Comprehensive treatment plan for ${patient.condition.toLowerCase()} management.`,
          phone: patient.phone,
          email: patient.email
        }
      })

      setTreatmentPlans(plans)
      setPatients(doctorPatients)

      // Calculate comprehensive statistics
      const stats = calculateTreatmentPlanStatistics(plans, doctorAppointments)
      setStatistics(stats)
    } catch (error) {
      console.error('Error fetching treatment plans data:', error)
      // Fallback data
      const fallbackPlans = [
        {
          id: 'TP001',
          patientId: 'P001',
          patientName: 'Priya Sharma',
          patientAge: 35,
          patientGender: 'Female',
          condition: 'Chronic Back Pain',
          doctor: 'Dr. Rajesh Kumar',
          planDetails: [
            { therapy: 'Abhyanga', frequency: '3x per week', duration: 60, sessions: 12 },
            { therapy: 'Shirodhara', frequency: '2x per week', duration: 45, sessions: 8 },
            { therapy: 'Udvartana', frequency: '1x per week', duration: 45, sessions: 6 }
          ],
          duration: 8,
          totalSessions: 26,
          completedSessions: 18,
          progress: 69.2,
          status: 'in-progress',
          startDate: '2024-01-01',
          nextSession: {
            date: '2024-01-20',
            time: '09:00 AM',
            therapy: 'Abhyanga'
          },
          notes: 'Comprehensive treatment plan for chronic back pain management.',
          phone: '+91 98765 43210',
          email: 'priya.sharma@email.com'
        },
        {
          id: 'TP002',
          patientId: 'P002',
          patientName: 'Raj Patel',
          patientAge: 42,
          patientGender: 'Male',
          condition: 'Stress & Anxiety',
          doctor: 'Dr. Rajesh Kumar',
          planDetails: [
            { therapy: 'Shirodhara', frequency: '3x per week', duration: 45, sessions: 15 },
            { therapy: 'Abhyanga', frequency: '2x per week', duration: 60, sessions: 10 },
            { therapy: 'Meditation', frequency: 'Daily', duration: 30, sessions: 30 }
          ],
          duration: 10,
          totalSessions: 55,
          completedSessions: 25,
          progress: 45.5,
          status: 'in-progress',
          startDate: '2024-01-05',
          nextSession: {
            date: '2024-01-18',
            time: '02:00 PM',
            therapy: 'Shirodhara'
          },
          notes: 'Stress and anxiety management through traditional Ayurvedic therapies.',
          phone: '+91 87654 32109',
          email: 'raj.patel@email.com'
        }
      ]
      setTreatmentPlans(fallbackPlans)
    } finally {
      setLoading(false)
    }
  }

  const calculateTreatmentPlanStatistics = (plans, appointments) => {
    // Plan Statistics
    const totalPlans = plans.length
    const statusCounts = plans.reduce((acc, plan) => {
      acc[plan.status] = (acc[plan.status] || 0) + 1
      return acc
    }, {})
    
    const completionRate = totalPlans > 0 ? (statusCounts.completed / totalPlans) * 100 : 0
    const averageProgress = plans.reduce((sum, plan) => sum + plan.progress, 0) / totalPlans
    
    // Condition Statistics
    const conditionCounts = {}
    const conditionSuccessRates = {}
    const conditionDurations = {}
    
    plans.forEach(plan => {
      conditionCounts[plan.condition] = (conditionCounts[plan.condition] || 0) + 1
      
      if (!conditionSuccessRates[plan.condition]) {
        conditionSuccessRates[plan.condition] = { completed: 0, total: 0 }
      }
      conditionSuccessRates[plan.condition].total++
      if (plan.status === 'completed') {
        conditionSuccessRates[plan.condition].completed++
      }
      
      if (!conditionDurations[plan.condition]) {
        conditionDurations[plan.condition] = []
      }
      conditionDurations[plan.condition].push(plan.duration)
    })
    
    // Calculate success rates
    Object.keys(conditionSuccessRates).forEach(condition => {
      const data = conditionSuccessRates[condition]
      conditionSuccessRates[condition] = (data.completed / data.total) * 100
    })
    
    // Calculate average durations
    Object.keys(conditionDurations).forEach(condition => {
      const durations = conditionDurations[condition]
      conditionDurations[condition] = durations.reduce((sum, dur) => sum + dur, 0) / durations.length
    })
    
    const topConditions = Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
    
    // Progress Statistics
    const progressDistribution = { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 }
    const totalSessions = plans.reduce((sum, plan) => sum + plan.totalSessions, 0)
    const completedSessions = plans.reduce((sum, plan) => sum + plan.completedSessions, 0)
    
    plans.forEach(plan => {
      if (plan.progress <= 25) progressDistribution['0-25']++
      else if (plan.progress <= 50) progressDistribution['26-50']++
      else if (plan.progress <= 75) progressDistribution['51-75']++
      else progressDistribution['76-100']++
    })
    
    // Outcome Statistics
    const averageTreatmentDuration = plans.reduce((sum, plan) => sum + plan.duration, 0) / totalPlans
    const averageSessionsPerPlan = totalSessions / totalPlans
    const sessionCompletionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0
    
    // Calculate therapy effectiveness
    const therapyEffectiveness = {}
    plans.forEach(plan => {
      plan.planDetails.forEach(detail => {
        if (!therapyEffectiveness[detail.therapy]) {
          therapyEffectiveness[detail.therapy] = { total: 0, effective: 0 }
        }
        therapyEffectiveness[detail.therapy].total++
        if (plan.status === 'completed' && plan.progress >= 75) {
          therapyEffectiveness[detail.therapy].effective++
        }
      })
    })
    
    Object.keys(therapyEffectiveness).forEach(therapy => {
      const data = therapyEffectiveness[therapy]
      therapyEffectiveness[therapy] = (data.effective / data.total) * 100
    })
    
    const topTherapies = Object.entries(therapyEffectiveness)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
    
    return {
      planStats: {
        totalPlans,
        statusCounts,
        completionRate,
        averageProgress,
        totalSessions,
        completedSessions,
        sessionCompletionRate
      },
      conditionStats: {
        conditionCounts,
        conditionSuccessRates,
        conditionDurations,
        topConditions
      },
      progressStats: {
        progressDistribution,
        averageTreatmentDuration,
        averageSessionsPerPlan
      },
      outcomeStats: {
        therapyEffectiveness,
        topTherapies,
        overallSuccessRate: completionRate,
        averageProgress
      }
    }
  }

  const filteredPlans = treatmentPlans.filter(plan => {
    const matchesSearch = plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || plan.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'primary'
      case 'not-started': return 'default'
      case 'paused': return 'warning'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />
      case 'in-progress': return <AccessTime />
      case 'not-started': return <Schedule />
      case 'paused': return <Warning />
      default: return <HealthAndSafety />
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan)
    setOpenDialog(true)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AyurSidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Loading treatment plans...</Typography>
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
              Treatment Plans
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage comprehensive treatment plans for your patients
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ height: '40px' }}
          >
            Create New Plan
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HealthAndSafety color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Plans</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {statistics.planStats.totalPlans || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {statistics.planStats.totalSessions || 0} total sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Success Rate</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {statistics.planStats.completionRate?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Plans completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Progress</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {statistics.planStats.averageProgress?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Overall progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Session Rate</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {statistics.planStats.sessionCompletionRate?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sessions completed
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
                  Condition Success Rates
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
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip label={`${count} plans`} size="small" color="primary" variant="outlined" />
                              <Chip 
                                label={`${statistics.conditionStats.conditionSuccessRates?.[condition]?.toFixed(1) || 0}%`} 
                                size="small" 
                                color="success" 
                                variant="outlined" 
                              />
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Avg duration: {statistics.conditionStats.conditionDurations?.[condition]?.toFixed(1) || 0} weeks
                          </Typography>
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
                  Progress Distribution
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {Object.entries(statistics.progressStats.progressDistribution || {}).map(([range, count]) => (
                    <Box key={range} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{range}%</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{count} plans</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Plan Status</Typography>
                  {Object.entries(statistics.planStats.statusCounts || {}).map(([status, count]) => (
                    <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{status.replace('-', ' ')}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{count}</Typography>
                    </Box>
                  ))}
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
                  Progress Distribution Chart
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Simple Pie Chart representation using horizontal bars */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                    {Object.entries(statistics.progressStats.progressDistribution || {}).map(([range, count], index) => {
                      const colors = ['error.main', 'warning.main', 'info.main', 'success.main']
                      const percentage = (count / statistics.planStats.totalPlans) * 100
                      return (
                        <Box key={range} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box 
                            sx={{ 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: colors[index % colors.length],
                              borderRadius: '50%'
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: '60px', fontSize: '0.75rem' }}>
                            {range}
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
                  Condition Success Rates
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Bar Chart for Condition Success Rates */}
                  <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 1, p: 2 }}>
                    {statistics.conditionStats.topConditions?.map(([condition, count], index) => {
                      const colors = ['primary.main', 'success.main', 'warning.main', 'info.main', 'error.main']
                      const successRate = statistics.conditionStats.conditionSuccessRates?.[condition] || 0
                      return (
                        <Box key={condition} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <Typography variant="caption" sx={{ mb: 1, fontSize: '0.6rem', textAlign: 'center' }}>
                            {condition.split(' ')[0]}
                          </Typography>
                          <Box 
                            sx={{ 
                              width: '100%', 
                              backgroundColor: colors[index % colors.length], 
                              borderRadius: '4px 4px 0 0',
                              height: `${Math.max(20, successRate)}px`,
                              minHeight: '20px'
                            }}
                          />
                          <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                            {successRate.toFixed(0)}%
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

        {/* Therapy Effectiveness Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Therapy Effectiveness
                </Typography>
                <List dense>
                  {statistics.outcomeStats.topTherapies?.map(([therapy, effectiveness], index) => (
                    <ListItem key={therapy} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {therapy}
                            </Typography>
                            <Chip 
                              label={`${effectiveness.toFixed(1)}%`} 
                              size="small" 
                              color={effectiveness >= 75 ? 'success' : effectiveness >= 50 ? 'warning' : 'error'}
                              variant="outlined" 
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Treatment Plan Performance Chart
                </Typography>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {/* Simple bar chart for treatment performance */}
                  <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ mb: 1 }}>Success Rate</Typography>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: 'success.main', 
                          borderRadius: '4px 4px 0 0',
                          height: `${Math.max(20, statistics.planStats.completionRate || 0)}px`,
                          minHeight: '20px',
                          maxHeight: '120px'
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                        {statistics.planStats.completionRate?.toFixed(1) || 0}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ mb: 1 }}>Avg Progress</Typography>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: 'primary.main', 
                          borderRadius: '4px 4px 0 0',
                          height: `${Math.max(20, statistics.planStats.averageProgress || 0)}px`,
                          minHeight: '20px',
                          maxHeight: '120px'
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                        {statistics.planStats.averageProgress?.toFixed(1) || 0}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ mb: 1 }}>Session Rate</Typography>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: 'warning.main', 
                          borderRadius: '4px 4px 0 0',
                          height: `${Math.max(20, statistics.planStats.sessionCompletionRate || 0)}px`,
                          minHeight: '20px',
                          maxHeight: '120px'
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                        {statistics.planStats.sessionCompletionRate?.toFixed(1) || 0}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Treatment Plan Analytics Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Treatment Plan Analytics Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="primary.contrastText">
                        {statistics.progressStats.averageTreatmentDuration?.toFixed(1) || 0}
                      </Typography>
                      <Typography variant="body2" color="primary.contrastText">
                        Avg Duration (weeks)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="success.contrastText">
                        {statistics.progressStats.averageSessionsPerPlan?.toFixed(1) || 0}
                      </Typography>
                      <Typography variant="body2" color="success.contrastText">
                        Avg Sessions/Plan
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="warning.contrastText">
                        {statistics.planStats.completedSessions || 0}
                      </Typography>
                      <Typography variant="body2" color="warning.contrastText">
                        Completed Sessions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="info.contrastText">
                        {statistics.outcomeStats.overallSuccessRate?.toFixed(1) || 0}%
                      </Typography>
                      <Typography variant="body2" color="info.contrastText">
                        Overall Success
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
                placeholder="Search treatment plans by patient or condition..."
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="all">All Plans</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="not-started">Not Started</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Treatment Plans Grid */}
        <Grid container spacing={3}>
          {filteredPlans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: getStatusColor(plan.status) + '.main',
                        mr: 2,
                        fontSize: '1.2rem',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(plan.patientName)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {plan.patientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.patientAge} years • {plan.patientGender}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(plan.status)}
                        label={plan.status.replace('-', ' ')}
                        size="small"
                        color={getStatusColor(plan.status)}
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Medical Condition
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.condition}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Treatment Progress
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {plan.completedSessions}/{plan.totalSessions} sessions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({Math.round(plan.progress)}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={plan.progress} 
                      color={getStatusColor(plan.status)}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Duration: {plan.duration} weeks
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Next Session
                    </Typography>
                    {plan.nextSession ? (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {plan.nextSession.therapy}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          {new Date(plan.nextSession.date).toLocaleDateString()} at {plan.nextSession.time}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No upcoming sessions
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(plan)}
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
                      Edit Plan
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredPlans.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No treatment plans found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria or create a new treatment plan.
            </Typography>
          </Paper>
        )}

        {/* Treatment Plan Details Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            Treatment Plan Details - {selectedPlan?.patientName}
          </DialogTitle>
          <DialogContent>
            {selectedPlan && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Patient Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {selectedPlan.patientName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Age:</strong> {selectedPlan.patientAge} years
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Gender:</strong> {selectedPlan.patientGender}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {selectedPlan.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {selectedPlan.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Condition:</strong> {selectedPlan.condition}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Plan Overview
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Duration:</strong> {selectedPlan.duration} weeks
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Total Sessions:</strong> {selectedPlan.totalSessions}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Completed:</strong> {selectedPlan.completedSessions}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Progress:</strong> {Math.round(selectedPlan.progress)}%
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Status:</strong> 
                      <Chip
                        label={selectedPlan.status.replace('-', ' ')}
                        size="small"
                        color={getStatusColor(selectedPlan.status)}
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Start Date:</strong> {new Date(selectedPlan.startDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Treatment Details
                    </Typography>
                    {selectedPlan.planDetails.map((detail, index) => (
                      <Accordion key={index} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <LocalHospital sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {detail.therapy}
                            </Typography>
                            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                              <Chip label={`${detail.sessions} sessions`} size="small" />
                              <Chip label={detail.frequency} size="small" variant="outlined" />
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Duration per session:</strong> {detail.duration} minutes
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Frequency:</strong> {detail.frequency}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Total sessions:</strong> {detail.sessions}
                              </Typography>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body2">
                      {selectedPlan.notes}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button variant="outlined">Edit Plan</Button>
            <Button variant="contained">Update Progress</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
