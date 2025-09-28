import React, { useEffect, useState } from 'react'
import { 
  Box, Grid, Card, Typography, Button, List, ListItem, ListItemText, 
  ListItemIcon, Avatar, Chip, Stack, LinearProgress, Paper
} from '@mui/material'
import { 
  CalendarToday, AccessTime, LocalHospital, Person, 
  Receipt, Schedule, BookOnline, HealthAndSafety
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [bills, setBills] = useState([])
  const [therapies, setTherapies] = useState([])
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    healthStats: {},
    financialStats: {},
    therapyStats: {},
    appointmentStats: {}
  })

  const calculatePatientStatistics = (appointments, bills, therapies) => {
    // Health Statistics
    const totalSessions = appointments.length
    const completedSessions = appointments.filter(apt => apt.status === 'completed').length
    const upcomingSessions = appointments.filter(apt => new Date(apt.date) >= new Date()).length
    const averageSessionDuration = appointments.reduce((sum, apt) => sum + (apt.duration || 60), 0) / totalSessions
    const therapyProgress = therapies.reduce((sum, therapy) => sum + therapy.progress, 0) / therapies.length
    const totalSessionsCompleted = therapies.reduce((sum, therapy) => sum + therapy.sessionsCompleted, 0)
    const totalSessionsPlanned = therapies.reduce((sum, therapy) => sum + therapy.totalSessions, 0)
    
    // Financial Statistics
    const totalSpent = bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + (bill.total || 0), 0)
    const pendingBills = bills.filter(bill => bill.status === 'pending')
    const totalPending = pendingBills.reduce((sum, bill) => sum + (bill.total || 0), 0)
    const averageBillAmount = bills.length > 0 ? bills.reduce((sum, bill) => sum + (bill.total || 0), 0) / bills.length : 0
    const monthlySpending = bills.filter(bill => {
      const billDate = new Date(bill.date)
      const currentDate = new Date()
      return billDate.getMonth() === currentDate.getMonth() && billDate.getFullYear() === currentDate.getFullYear()
    }).reduce((sum, bill) => sum + (bill.total || 0), 0)
    
    // Therapy Statistics
    const therapyTypes = [...new Set(appointments.map(apt => apt.therapy))]
    const mostFrequentTherapy = therapyTypes.reduce((most, therapy) => {
      const count = appointments.filter(apt => apt.therapy === therapy).length
      return count > (most.count || 0) ? { therapy, count } : most
    }, {})
    
    const therapyDistribution = {}
    appointments.forEach(apt => {
      therapyDistribution[apt.therapy] = (therapyDistribution[apt.therapy] || 0) + 1
    })
    
    // Appointment Statistics
    const appointmentStatusCounts = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1
      return acc
    }, {})
    
    const monthlyAppointments = {}
    appointments.forEach(apt => {
      const month = new Date(apt.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      monthlyAppointments[month] = (monthlyAppointments[month] || 0) + 1
    })
    
    const averageDaysBetweenSessions = appointments.length > 1 ? 
      (new Date(appointments[appointments.length - 1].date) - new Date(appointments[0].date)) / 
      (1000 * 60 * 60 * 24 * (appointments.length - 1)) : 0
    
    return {
      healthStats: {
        totalSessions,
        completedSessions,
        upcomingSessions,
        averageSessionDuration,
        therapyProgress,
        totalSessionsCompleted,
        totalSessionsPlanned,
        completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0
      },
      financialStats: {
        totalSpent,
        pendingBills: pendingBills.length,
        totalPending,
        averageBillAmount,
        monthlySpending,
        paidBills: bills.filter(bill => bill.status === 'paid').length,
        totalBills: bills.length
      },
      therapyStats: {
        therapyTypes,
        mostFrequentTherapy,
        therapyDistribution,
        activeTherapies: therapies.length,
        averageProgress: therapyProgress
      },
      appointmentStats: {
        appointmentStatusCounts,
        monthlyAppointments,
        averageDaysBetweenSessions,
        totalAppointments: appointments.length
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, billingRes, patientsRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/billing'),
          api.get('/patients')
        ])
        
        // For patient role, use demo patient data
        const currentPatient = patientsRes.data.patients?.find(p => p.id === 'P001') || patientsRes.data.patients?.[0]
        
        // Filter data for current patient - use P001 as demo patient
        const patientAppointments = appointmentsRes.data.appointments?.filter(apt => 
          apt.patientId === 'P001' || apt.patientName === 'Priya Sharma'
        ) || []
        
        const patientBills = billingRes.data.bills?.filter(bill => 
          bill.patientId === 'P001' || bill.patientName === 'Priya Sharma'
        ) || []

        setAppointments(patientAppointments)
        setBills(patientBills)
        
        
        // Enhanced therapy data based on patient's medical history
        const therapyData = [
          { 
            name: 'Abhyanga', 
            nextSession: '2024-12-25', 
            progress: 75,
            sessionsCompleted: 8,
            totalSessions: 12,
            benefits: 'Stress relief, improved circulation',
            nextSteps: 'Continue twice weekly sessions'
          },
          { 
            name: 'Shirodhara', 
            nextSession: '2024-12-27', 
            progress: 60,
            sessionsCompleted: 6,
            totalSessions: 10,
            benefits: 'Headache relief, better sleep',
            nextSteps: 'Increase session frequency'
          },
          { 
            name: 'Panchakarma', 
            nextSession: '2024-12-30', 
            progress: 40,
            sessionsCompleted: 4,
            totalSessions: 10,
            benefits: 'Detoxification, digestive health',
            nextSteps: 'Complete detoxification cycle'
          }
        ]
        
        setTherapies(therapyData)
        
        // Calculate comprehensive statistics
        const stats = calculatePatientStatistics(patientAppointments, patientBills, therapyData)
        setStatistics(stats)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback data if API fails
        setAppointments([
          {
            id: '1',
            patientName: 'Priya Sharma',
            therapy: 'Abhyanga',
            date: '2024-12-25',
            time: '09:00',
            doctorName: 'Dr. Rajesh Kumar',
            status: 'confirmed',
            duration: 60
          },
          {
            id: '2',
            patientName: 'Priya Sharma',
            therapy: 'Shirodhara',
            date: '2024-12-27',
            time: '14:00',
            doctorName: 'Dr. Rajesh Kumar',
            status: 'scheduled',
            duration: 45
          }
        ])
        setBills([
          {
            id: '1',
            billNumber: 'AYR-2024-001',
            date: '2024-12-20',
            items: ['Abhyanga Session', 'Shirodhara Session'],
            total: 2500,
            status: 'paid',
            paymentMethod: 'UPI'
          },
          {
            id: '2',
            billNumber: 'AYR-2024-002',
            date: '2024-12-15',
            items: ['Consultation', 'Abhyanga Session'],
            total: 1800,
            status: 'paid',
            paymentMethod: 'Card'
          }
        ])
        setTherapies([
          { 
            name: 'Abhyanga', 
            nextSession: '2024-12-25', 
            progress: 75,
            sessionsCompleted: 8,
            totalSessions: 12,
            benefits: 'Stress relief, improved circulation',
            nextSteps: 'Continue twice weekly sessions'
          },
          { 
            name: 'Shirodhara', 
            nextSession: '2024-12-27', 
            progress: 60,
            sessionsCompleted: 6,
            totalSessions: 10,
            benefits: 'Headache relief, better sleep',
            nextSteps: 'Increase session frequency'
          },
          { 
            name: 'Panchakarma', 
            nextSession: '2024-12-30', 
            progress: 40,
            sessionsCompleted: 4,
            totalSessions: 10,
            benefits: 'Detoxification, digestive health',
            nextSteps: 'Complete detoxification cycle'
          }
        ])
        
        // Calculate statistics for fallback data too
        const fallbackStats = calculatePatientStatistics(appointments, bills, therapies)
        setStatistics(fallbackStats)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) >= new Date()
  ).slice(0, 3)

  const recentBills = bills.slice(0, 3)
  const totalSpent = bills.filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + (bill.total || 0), 0)
    

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
          Welcome back, {user?.name || 'Patient'}!
        </Typography>

        {/* Patient Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Upcoming Sessions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {upcomingAppointments.length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                Next: {upcomingAppointments[0]?.date || 'No sessions'}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <LocalHospital />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Therapy Progress
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {Math.round(therapies.reduce((acc, t) => acc + t.progress, 0) / therapies.length)}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.round(therapies.reduce((acc, t) => acc + t.progress, 0) / therapies.length)}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Receipt />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Total Spent
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                {bills.filter(b => b.status === 'paid').length} bills paid
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <HealthAndSafety />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Active Therapies
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {therapies.length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                Personalized treatment plan
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Visual Analytics Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Therapy Progress Distribution
              </Typography>
              <Box sx={{ height: 200, position: 'relative' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                  {therapies.map((therapy, index) => {
                    const colors = ['primary.main', 'success.main', 'warning.main', 'info.main', 'error.main']
                    return (
                      <Box key={therapy.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                          sx={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: colors[index % colors.length],
                            borderRadius: '50%'
                          }}
                        />
                        <Typography variant="body2" sx={{ minWidth: '100px', fontSize: '0.75rem' }}>
                          {therapy.name}
                        </Typography>
                        <Box sx={{ flex: 1, height: '20px', backgroundColor: 'grey.200', borderRadius: '10px', overflow: 'hidden' }}>
                          <Box 
                            sx={{ 
                              width: `${therapy.progress}%`, 
                              height: '100%', 
                              backgroundColor: colors[index % colors.length],
                              borderRadius: '10px',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ minWidth: '40px', textAlign: 'right' }}>
                          {therapy.progress}%
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Monthly Appointment Trends
              </Typography>
              <Box sx={{ height: 200, position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 2, p: 2 }}>
                  {Object.entries(statistics.appointmentStats.monthlyAppointments || {}).map(([month, count], index) => {
                    const colors = ['primary.main', 'success.main', 'warning.main', 'info.main', 'error.main']
                    const maxCount = Math.max(...Object.values(statistics.appointmentStats.monthlyAppointments || {}))
                    const height = maxCount > 0 ? (count / maxCount) * 120 : 20
                    return (
                      <Box key={month} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <Typography variant="caption" sx={{ mb: 1, fontSize: '0.6rem', textAlign: 'center' }}>
                          {month.split(' ')[0]}
                        </Typography>
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
            </Card>
          </Grid>
        </Grid>

        {/* Health & Financial Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Health Progress Metrics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Session Completion</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {statistics.healthStats.completionRate?.toFixed(1) || 0}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={statistics.healthStats.completionRate || 0} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall Progress</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {statistics.healthStats.therapyProgress?.toFixed(1) || 0}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={statistics.healthStats.therapyProgress || 0} 
                  color="primary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sessions Completed</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {statistics.healthStats.totalSessionsCompleted || 0}/{statistics.healthStats.totalSessionsPlanned || 0}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={statistics.healthStats.totalSessionsPlanned > 0 ? 
                    (statistics.healthStats.totalSessionsCompleted / statistics.healthStats.totalSessionsPlanned) * 100 : 0} 
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Financial Overview Chart
              </Typography>
              <Box sx={{ height: 200, position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'end', height: '100%', gap: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Typography variant="caption" sx={{ mb: 1 }}>Total Spent</Typography>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        backgroundColor: 'success.main', 
                        borderRadius: '4px 4px 0 0',
                        height: `${Math.max(20, (statistics.financialStats.totalSpent || 0) / 1000)}px`,
                        minHeight: '20px',
                        maxHeight: '120px'
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                      ₹{(statistics.financialStats.totalSpent || 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Typography variant="caption" sx={{ mb: 1 }}>Monthly Spending</Typography>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        backgroundColor: 'primary.main', 
                        borderRadius: '4px 4px 0 0',
                        height: `${Math.max(20, (statistics.financialStats.monthlySpending || 0) / 500)}px`,
                        minHeight: '20px',
                        maxHeight: '120px'
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                      ₹{(statistics.financialStats.monthlySpending || 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Typography variant="caption" sx={{ mb: 1 }}>Pending Bills</Typography>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        backgroundColor: 'warning.main', 
                        borderRadius: '4px 4px 0 0',
                        height: `${Math.max(20, (statistics.financialStats.totalPending || 0) / 1000)}px`,
                        minHeight: '20px',
                        maxHeight: '120px'
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                      ₹{(statistics.financialStats.totalPending || 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Typography variant="caption" sx={{ mb: 1 }}>Avg Bill</Typography>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        backgroundColor: 'info.main', 
                        borderRadius: '4px 4px 0 0',
                        height: `${Math.max(20, (statistics.financialStats.averageBillAmount || 0) / 100)}px`,
                        minHeight: '20px',
                        maxHeight: '120px'
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                      ₹{(statistics.financialStats.averageBillAmount || 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Patient-Specific Sections */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Upcoming Appointments */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1 }} />
                Your Upcoming Sessions
              </Typography>
              <List>
                {upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <AccessTime />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={`${appointment.therapy} Session`}
                      secondary={`${appointment.date} at ${appointment.time} - ${appointment.doctorName}`}
                    />
                    <Chip 
                      label={appointment.status} 
                      color={appointment.status === 'confirmed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
                {upcomingAppointments.length === 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                    No upcoming sessions scheduled
                  </Typography>
                )}
              </List>
            </Card>
          </Grid>

          {/* Therapy Progress */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <LocalHospital sx={{ mr: 1 }} />
                Therapy Progress
              </Typography>
              <Stack spacing={3}>
                {therapies.map((therapy) => (
                  <Box key={therapy.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {therapy.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {therapy.sessionsCompleted}/{therapy.totalSessions} sessions
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={therapy.progress}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Next session: {therapy.nextSession}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'success.main', display: 'block', mb: 0.5 }}>
                      Benefits: {therapy.benefits}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'info.main', display: 'block' }}>
                      Next steps: {therapy.nextSteps}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Bills */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Receipt sx={{ mr: 1 }} />
                Recent Bills & Payments
              </Typography>
              <List>
                {recentBills.map((bill) => (
                  <ListItem key={bill.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: bill.status === 'paid' ? 'success.main' : 'warning.main' 
                      }}>
                        <Receipt />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={`${bill.billNumber} - ${bill.date}`}
                      secondary={`${bill.items.length} items - ${bill.paymentMethod}`}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ₹{bill.total.toLocaleString('en-IN')}
                      </Typography>
                      <Chip 
                        label={bill.status} 
                        color={bill.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>

        {/* Comprehensive Statistics Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <HealthAndSafety sx={{ mr: 1 }} />
                Your Health Journey Analytics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {statistics.healthStats.totalSessions || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total Sessions
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'success.main' }}>
                      {statistics.healthStats.completedSessions || 0} completed
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {statistics.healthStats.completionRate?.toFixed(1) || 0}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Completion Rate
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'info.main' }}>
                      {statistics.healthStats.upcomingSessions || 0} upcoming
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {statistics.healthStats.averageSessionDuration?.toFixed(0) || 0} min
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Avg Session Duration
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                      {statistics.healthStats.averageDaysBetweenSessions?.toFixed(0) || 0} days between sessions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                      ₹{(statistics.financialStats.totalSpent || 0).toLocaleString('en-IN')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total Investment
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      ₹{(statistics.financialStats.monthlySpending || 0).toLocaleString('en-IN')} this month
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {/* Patient Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<BookOnline />}>
            Book New Session
          </Button>
          <Button variant="outlined" startIcon={<CalendarToday />}>
            View Full Schedule
          </Button>
          <Button variant="outlined" startIcon={<Receipt />}>
            View All Bills
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
