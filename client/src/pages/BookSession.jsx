import React, { useEffect, useState } from 'react'
import { 
  Box, Grid, Card, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemText, ListItemIcon, Avatar, Chip, Stack, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { 
  CalendarToday, AccessTime, LocalHospital, Person, 
  Schedule, Add, CheckCircle, Info
} from '@mui/icons-material'
// Date picker imports removed - using simple date input instead
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function BookSession() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTherapy, setSelectedTherapy] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [bookingOpen, setBookingOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const therapies = [
    { id: '1', name: 'Abhyanga (Oil Massage)', duration: 60, price: 3000, description: 'Traditional Ayurvedic full-body oil massage' },
    { id: '2', name: 'Shirodhara (Head Therapy)', duration: 45, price: 2500, description: 'Continuous flow of warm oil on forehead' },
    { id: '3', name: 'Panchakarma (Detoxification)', duration: 120, price: 8000, description: 'Comprehensive detoxification program' },
    { id: '4', name: 'Udwarthana (Herbal Powder Massage)', duration: 90, price: 4000, description: 'Herbal powder massage for weight management' },
    { id: '5', name: 'Basti (Therapeutic Enema)', duration: 45, price: 3500, description: 'Medicated enema for digestive health' },
    { id: '6', name: 'Nasya (Nasal Therapy)', duration: 30, price: 1500, description: 'Nasal administration of medicated oils' }
  ]

  const doctors = [
    { id: '1', name: 'Dr. Rajesh Kumar', specialization: 'General Ayurveda', experience: '15 years', rating: 4.9 },
    { id: '2', name: 'Dr. Sunita Reddy', specialization: 'Panchakarma Specialist', experience: '12 years', rating: 4.8 },
    { id: '3', name: 'Dr. Vikram Singh', specialization: 'Head & Neck Therapy', experience: '10 years', rating: 4.7 },
    { id: '4', name: 'Dr. Anjali Mehta', specialization: 'Weight Management', experience: '8 years', rating: 4.6 }
  ]

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const rooms = [
    'Therapy Room 1', 'Therapy Room 2', 'Therapy Room 3', 'Panchakarma Suite A', 'Panchakarma Suite B'
  ]

  useEffect(() => {
    // Generate available slots based on selected date and therapy
    if (selectedDate && selectedTherapy && selectedDoctor) {
      const slots = timeSlots.filter(slot => {
        // Simulate availability - in real app, this would come from API
        const random = Math.random()
        return random > 0.3 // 70% availability
      })
      setAvailableSlots(slots)
    }
  }, [selectedDate, selectedTherapy, selectedDoctor])

  const handleBookSession = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, this would be an API call
      console.log('Booking session:', {
        date: selectedDate,
        therapy: selectedTherapy,
        doctor: selectedDoctor,
        time: selectedTime
      })
      
      setBookingOpen(true)
    } catch (error) {
      console.error('Error booking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedTherapyData = therapies.find(t => t.id === selectedTherapy)
  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor)

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
      <AyurSidebar />
      <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, mb: 3 }}>
          Book New Session
        </Typography>

        <Grid container spacing={4}>
          {/* Booking Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Select Your Session Details
              </Typography>

              <Stack spacing={3}>
                {/* Date Selection */}
                <TextField
                  label="Select Date"
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  fullWidth
                />

                {/* Therapy Selection */}
                <FormControl fullWidth>
                  <InputLabel>Therapy Type</InputLabel>
                  <Select
                    value={selectedTherapy}
                    label="Therapy Type"
                    onChange={(e) => setSelectedTherapy(e.target.value)}
                  >
                    {therapies.map((therapy) => (
                      <MenuItem key={therapy.id} value={therapy.id}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {therapy.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {therapy.duration} min • ₹{therapy.price}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Doctor Selection */}
                <FormControl fullWidth>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={selectedDoctor}
                    label="Doctor"
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {doctor.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {doctor.specialization} • {doctor.experience} • ⭐ {doctor.rating}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Time Selection */}
                {availableSlots.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Available Time Slots
                    </Typography>
                    <Grid container spacing={2}>
                      {availableSlots.map((slot) => (
                        <Grid item xs={4} sm={3} md={2} key={slot}>
                          <Button
                            variant={selectedTime === slot ? 'contained' : 'outlined'}
                            fullWidth
                            onClick={() => setSelectedTime(slot)}
                            sx={{ minHeight: 48 }}
                          >
                            {slot}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Booking Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleBookSession}
                  disabled={!selectedDate || !selectedTherapy || !selectedDoctor || !selectedTime || loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Booking...' : 'Book Session'}
                </Button>
              </Stack>
            </Card>
          </Grid>

          {/* Session Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Session Summary
              </Typography>

              {selectedTherapyData && selectedDoctorData ? (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Therapy
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedTherapyData.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {selectedTherapyData.description}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Doctor
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedDoctorData.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {selectedDoctorData.specialization}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Date & Time
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedDate?.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {selectedTime}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Duration
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedTherapyData.duration} minutes
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Total Cost
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ₹{selectedTherapyData.price.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Select therapy and doctor to see session details
                </Typography>
              )}
            </Card>

            {/* Popular Therapies */}
            <Card sx={{ p: 3, borderRadius: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Popular Therapies
              </Typography>
              <Stack spacing={2}>
                {therapies.slice(0, 3).map((therapy) => (
                  <Paper key={therapy.id} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {therapy.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {therapy.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{therapy.price}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {therapy.duration} min
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Booking Confirmation Dialog */}
        <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Session Booked Successfully!</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your session has been confirmed
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                You will receive a confirmation email shortly with all the details.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Session Details:
                </Typography>
                <Typography variant="body2">
                  {selectedTherapyData?.name} with {selectedDoctorData?.name}
                </Typography>
                <Typography variant="body2">
                  {selectedDate?.toLocaleDateString()} at {selectedTime}
                </Typography>
                <Typography variant="body2">
                  Duration: {selectedTherapyData?.duration} minutes
                </Typography>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingOpen(false)}>Close</Button>
            <Button variant="contained" onClick={() => setBookingOpen(false)}>
              View My Sessions
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
