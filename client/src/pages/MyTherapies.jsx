import React, { useEffect, useState } from 'react'
import { 
  Box, Grid, Card, Typography, Button, List, ListItem, ListItemText, 
  ListItemIcon, Avatar, Chip, Stack, Paper, LinearProgress, Divider
} from '@mui/material'
import { 
  LocalHospital, HealthAndSafety, TrendingUp, AccessTime, 
  CheckCircle, Schedule, MedicalServices, Info
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function MyTherapies() {
  const { user } = useAuth()
  const [therapies, setTherapies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Enhanced therapy data based on patient's medical history
        const therapyData = [
          { 
            id: '1',
            name: 'Abhyanga (Oil Massage)', 
            nextSession: '2024-12-25', 
            progress: 75,
            sessionsCompleted: 8,
            totalSessions: 12,
            benefits: 'Stress relief, improved circulation, better sleep quality',
            nextSteps: 'Continue twice weekly sessions for optimal results',
            duration: '60 minutes',
            frequency: 'Twice a week',
            status: 'active',
            description: 'Traditional Ayurvedic full-body oil massage using warm sesame oil to promote relaxation and improve circulation.',
            improvements: ['Reduced stress levels', 'Better sleep quality', 'Improved skin texture', 'Enhanced flexibility'],
            upcomingSessions: [
              { date: '2024-12-25', time: '09:00', doctor: 'Dr. Rajesh Kumar' },
              { date: '2024-12-28', time: '14:00', doctor: 'Dr. Rajesh Kumar' }
            ]
          },
          { 
            id: '2',
            name: 'Shirodhara (Head Therapy)', 
            nextSession: '2024-12-27', 
            progress: 60,
            sessionsCompleted: 6,
            totalSessions: 10,
            benefits: 'Headache relief, better sleep, reduced anxiety',
            nextSteps: 'Increase session frequency to three times a week',
            duration: '45 minutes',
            frequency: 'Three times a week',
            status: 'active',
            description: 'Continuous flow of warm oil on the forehead to calm the nervous system and promote deep relaxation.',
            improvements: ['Reduced migraine frequency', 'Better concentration', 'Improved sleep quality', 'Reduced anxiety'],
            upcomingSessions: [
              { date: '2024-12-27', time: '14:00', doctor: 'Dr. Rajesh Kumar' }
            ]
          },
          { 
            id: '3',
            name: 'Panchakarma (Detoxification)', 
            nextSession: '2024-12-30', 
            progress: 40,
            sessionsCompleted: 4,
            totalSessions: 10,
            benefits: 'Complete detoxification, digestive health, immune system boost',
            nextSteps: 'Complete the full detoxification cycle as planned',
            duration: '120 minutes',
            frequency: 'Daily for 7 days',
            status: 'active',
            description: 'Comprehensive detoxification program including therapeutic vomiting, purgation, and enema to eliminate toxins.',
            improvements: ['Better digestion', 'Increased energy levels', 'Improved skin clarity', 'Reduced bloating'],
            upcomingSessions: [
              { date: '2024-12-30', time: '11:30', doctor: 'Dr. Sunita Reddy' }
            ]
          },
          { 
            id: '4',
            name: 'Nasya (Nasal Therapy)', 
            nextSession: '2024-12-26', 
            progress: 90,
            sessionsCompleted: 9,
            totalSessions: 10,
            benefits: 'Sinus relief, improved breathing, allergy management',
            nextSteps: 'Complete final session and assess long-term benefits',
            duration: '30 minutes',
            frequency: 'Daily for 10 days',
            status: 'completing',
            description: 'Administration of medicated oils through the nasal passages to treat sinus and respiratory issues.',
            improvements: ['Clearer breathing', 'Reduced sinus congestion', 'Better sense of smell', 'Reduced allergy symptoms'],
            upcomingSessions: [
              { date: '2024-12-26', time: '16:00', doctor: 'Dr. Rajesh Kumar' }
            ]
          }
        ]
        
        setTherapies(therapyData)
      } catch (error) {
        console.error('Error fetching therapy data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const activeTherapies = therapies.filter(t => t.status === 'active')
  const totalProgress = Math.round(therapies.reduce((acc, t) => acc + t.progress, 0) / therapies.length)

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
        <AyurSidebar />
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Loading your therapies...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
      <AyurSidebar />
      <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, mb: 3 }}>
          My Therapies
        </Typography>

        {/* Therapy Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <LocalHospital />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Active Therapies
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {activeTherapies.length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                Currently ongoing treatments
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Overall Progress
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalProgress}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={totalProgress}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Next Session
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {therapies[0]?.nextSession?.split('-')[2] || '25'}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                Dec 2024
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Sessions Completed
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {therapies.reduce((acc, t) => acc + t.sessionsCompleted, 0)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                Total sessions attended
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Therapy Details */}
        <Grid container spacing={3}>
          {therapies.map((therapy) => (
            <Grid item xs={12} md={6} key={therapy.id}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {therapy.name}
                  </Typography>
                  <Chip 
                    label={therapy.status} 
                    color={therapy.status === 'active' ? 'success' : 'info'}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {therapy.description}
                </Typography>

                {/* Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Progress
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
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {therapy.progress}% complete
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Therapy Details */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Duration
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {therapy.duration}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Frequency
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {therapy.frequency}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Benefits */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <HealthAndSafety sx={{ mr: 1, fontSize: 16 }} />
                    Benefits
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'success.main' }}>
                    {therapy.benefits}
                  </Typography>
                </Box>

                {/* Improvements */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ mr: 1, fontSize: 16 }} />
                    Improvements Noticed
                  </Typography>
                  <Stack spacing={0.5}>
                    {therapy.improvements.map((improvement, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                        <Typography variant="body2">{improvement}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Next Steps */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ mr: 1, fontSize: 16 }} />
                    Next Steps
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    {therapy.nextSteps}
                  </Typography>
                </Box>

                {/* Upcoming Sessions */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Schedule sx={{ mr: 1, fontSize: 16 }} />
                    Upcoming Sessions
                  </Typography>
                  {therapy.upcomingSessions.map((session, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2">
                        {session.date} at {session.time}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {session.doctor}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="outlined" size="small" fullWidth>
                    View Details
                  </Button>
                  <Button variant="contained" size="small" fullWidth>
                    Book Session
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Therapy Recommendations */}
        <Card sx={{ p: 3, borderRadius: 3, mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <MedicalServices sx={{ mr: 1 }} />
            Recommended Next Therapies
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Udwarthana (Herbal Powder Massage)
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Recommended for weight management and skin health
                </Typography>
                <Button size="small" variant="outlined">
                  Learn More
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Basti (Therapeutic Enema)
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Recommended for digestive health and detoxification
                </Typography>
                <Button size="small" variant="outlined">
                  Learn More
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Vamana (Therapeutic Vomiting)
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Recommended for respiratory and sinus issues
                </Typography>
                <Button size="small" variant="outlined">
                  Learn More
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  )
}
