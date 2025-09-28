import express from 'express'

// Comprehensive appointment and scheduling data
let appointments = [
  // Today's appointments
  {
    id: '1',
    patientName: 'Priya Sharma',
    patientId: 'P001',
    doctorName: 'Dr. Rajesh Kumar',
    therapy: 'Abhyanga',
    time: '09:00',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    status: 'confirmed',
    room: 'Therapy Room 1',
    notes: 'First session - stress relief',
    phone: '+91-9876543210',
    age: 34,
    gender: 'female'
  },
  {
    id: '2',
    patientName: 'Amit Patel',
    patientId: 'P002',
    doctorName: 'Dr. Sunita Reddy',
    therapy: 'Panchakarma',
    time: '10:30',
    date: new Date().toISOString().split('T')[0],
    duration: 120,
    status: 'in-progress',
    room: 'Panchakarma Suite A',
    notes: 'Detoxification program - day 3',
    phone: '+91-9876543212',
    age: 42,
    gender: 'male'
  },
  {
    id: '3',
    patientName: 'Sneha Gupta',
    patientId: 'P003',
    doctorName: 'Dr. Vikram Singh',
    therapy: 'Shirodhara',
    time: '14:00',
    date: new Date().toISOString().split('T')[0],
    duration: 45,
    status: 'scheduled',
    room: 'Therapy Room 2',
    notes: 'Migraine treatment',
    phone: '+91-9876543214',
    age: 28,
    gender: 'female'
  },
  {
    id: '4',
    patientName: 'Ravi Kumar',
    patientId: 'P004',
    doctorName: 'Dr. Anjali Mehta',
    therapy: 'Udwarthana',
    time: '16:00',
    date: new Date().toISOString().split('T')[0],
    duration: 90,
    status: 'confirmed',
    room: 'Therapy Room 3',
    notes: 'Weight management program',
    phone: '+91-9876543216',
    age: 38,
    gender: 'male'
  },
  {
    id: '7',
    patientName: 'Deepika Reddy',
    patientId: 'P007',
    doctorName: 'Dr. Rajesh Kumar',
    therapy: 'Nasya',
    time: '11:30',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    status: 'completed',
    room: 'Therapy Room 1',
    notes: 'Sinus treatment',
    phone: '+91-9876543222',
    age: 29,
    gender: 'female'
  },
  {
    id: '8',
    patientName: 'Vikram Joshi',
    patientId: 'P008',
    doctorName: 'Dr. Sunita Reddy',
    therapy: 'Abhyanga',
    time: '15:00',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    status: 'cancelled',
    room: 'Therapy Room 2',
    notes: 'Patient cancelled due to emergency',
    phone: '+91-9876543223',
    age: 45,
    gender: 'male'
  },
  // Tomorrow's appointments
  {
    id: '5',
    patientName: 'Kavita Singh',
    patientId: 'P005',
    doctorName: 'Dr. Rajesh Kumar',
    therapy: 'Basti',
    time: '09:30',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 60,
    status: 'scheduled',
    room: 'Therapy Room 1',
    notes: 'Digestive health treatment',
    phone: '+91-9876543218',
    age: 45,
    gender: 'female'
  },
  {
    id: '6',
    patientName: 'Mohammed Ali',
    patientId: 'P006',
    doctorName: 'Dr. Sunita Reddy',
    therapy: 'Abhyanga',
    time: '11:00',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 60,
    status: 'scheduled',
    room: 'Therapy Room 2',
    notes: 'General wellness',
    phone: '+91-9876543220',
    age: 52,
    gender: 'male'
  },
  {
    id: '9',
    patientName: 'Anita Desai',
    patientId: 'P009',
    doctorName: 'Dr. Vikram Singh',
    therapy: 'Virechana',
    time: '08:00',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 180,
    status: 'scheduled',
    room: 'Panchakarma Suite B',
    notes: 'Detoxification therapy',
    phone: '+91-9876543224',
    age: 38,
    gender: 'female'
  },
  {
    id: '10',
    patientName: 'Rajesh Mehta',
    patientId: 'P010',
    doctorName: 'Dr. Anjali Mehta',
    therapy: 'Udwarthana',
    time: '14:30',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 90,
    status: 'scheduled',
    room: 'Therapy Room 3',
    notes: 'Weight loss program',
    phone: '+91-9876543225',
    age: 41,
    gender: 'male'
  },
  // Day after tomorrow
  {
    id: '11',
    patientName: 'Sunita Agarwal',
    patientId: 'P011',
    doctorName: 'Dr. Rajesh Kumar',
    therapy: 'Shirodhara',
    time: '10:00',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 45,
    status: 'scheduled',
    room: 'Therapy Room 1',
    notes: 'Stress management',
    phone: '+91-9876543226',
    age: 33,
    gender: 'female'
  },
  {
    id: '12',
    patientName: 'Arjun Singh',
    patientId: 'P012',
    doctorName: 'Dr. Sunita Reddy',
    therapy: 'Vamana',
    time: '07:00',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 180,
    status: 'scheduled',
    room: 'Panchakarma Suite A',
    notes: 'Respiratory treatment',
    phone: '+91-9876543227',
    age: 36,
    gender: 'male'
  }
]

// Available time slots for scheduling
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
]

// Available therapies
const therapies = [
  { id: '1', name: 'Abhyanga', duration: 60, price: 3000, description: 'Full body oil massage' },
  { id: '2', name: 'Panchakarma', duration: 120, price: 15000, description: 'Complete detoxification' },
  { id: '3', name: 'Shirodhara', duration: 45, price: 2500, description: 'Oil pouring on forehead' },
  { id: '4', name: 'Udwarthana', duration: 90, price: 4000, description: 'Herbal powder massage' },
  { id: '5', name: 'Basti', duration: 60, price: 3500, description: 'Medicated enema therapy' },
  { id: '6', name: 'Nasya', duration: 30, price: 1500, description: 'Nasal administration of medicines' },
  { id: '7', name: 'Virechana', duration: 180, price: 8000, description: 'Purgation therapy' },
  { id: '8', name: 'Vamana', duration: 180, price: 8000, description: 'Therapeutic vomiting' }
]

// Available doctors
const doctors = [
  { id: '1', name: 'Dr. Rajesh Kumar', specialization: 'Panchakarma', experience: '15 years' },
  { id: '2', name: 'Dr. Sunita Reddy', specialization: 'General Ayurveda', experience: '12 years' },
  { id: '3', name: 'Dr. Vikram Singh', specialization: 'Neurology', experience: '18 years' },
  { id: '4', name: 'Dr. Anjali Mehta', specialization: 'Women\'s Health', experience: '10 years' }
]

// Available rooms
const rooms = [
  { id: '1', name: 'Therapy Room 1', type: 'Standard', capacity: 1 },
  { id: '2', name: 'Therapy Room 2', type: 'Standard', capacity: 1 },
  { id: '3', name: 'Therapy Room 3', type: 'Standard', capacity: 1 },
  { id: '4', name: 'Panchakarma Suite A', type: 'Premium', capacity: 1 },
  { id: '5', name: 'Panchakarma Suite B', type: 'Premium', capacity: 1 },
  { id: '6', name: 'Consultation Room 1', type: 'Consultation', capacity: 2 },
  { id: '7', name: 'Consultation Room 2', type: 'Consultation', capacity: 2 }
]

const router = express.Router()

// Get all appointments
router.get('/', (req, res) => {
  const { date, status, doctor } = req.query
  
  let filteredAppointments = appointments
  
  if (date) {
    filteredAppointments = filteredAppointments.filter(apt => apt.date === date)
  }
  
  if (status) {
    filteredAppointments = filteredAppointments.filter(apt => apt.status === status)
  }
  
  if (doctor) {
    filteredAppointments = filteredAppointments.filter(apt => apt.doctorName.includes(doctor))
  }
  
  res.json({ appointments: filteredAppointments })
})

// Get appointments for a specific week
router.get('/week', (req, res) => {
  const { startDate } = req.query
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  const weekAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date)
    return aptDate >= start && aptDate <= end
  })
  
  res.json({ appointments: weekAppointments })
})

// Create new appointment
router.post('/', (req, res) => {
  const appointment = {
    id: String(Date.now()),
    ...req.body,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  }
  
  appointments.push(appointment)
  res.status(201).json(appointment)
})

// Update appointment
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = appointments.findIndex(apt => apt.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' })
  }
  
  appointments[index] = { ...appointments[index], ...req.body }
  res.json(appointments[index])
})

// Delete appointment
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = appointments.findIndex(apt => apt.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' })
  }
  
  appointments.splice(index, 1)
  res.json({ message: 'Appointment deleted successfully' })
})

// Get available time slots for a specific date and doctor
router.get('/slots', (req, res) => {
  const { date, doctorId, therapyId } = req.query
  
  // Get existing appointments for the date and doctor
  const existingAppointments = appointments.filter(apt => 
    apt.date === date && apt.doctorName.includes(doctors.find(d => d.id === doctorId)?.name || '')
  )
  
  // Filter out occupied time slots
  const occupiedSlots = existingAppointments.map(apt => apt.time)
  const availableSlots = timeSlots.filter(slot => !occupiedSlots.includes(slot))
  
  res.json({ 
    availableSlots,
    occupiedSlots,
    timeSlots 
  })
})

// Get master data
router.get('/master-data', (req, res) => {
  res.json({
    therapies,
    doctors,
    rooms,
    timeSlots
  })
})

// Get appointment statistics
router.get('/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(apt => apt.date === today)
  
  const stats = {
    total: appointments.length,
    today: todayAppointments.length,
    byStatus: {
      scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      'in-progress': appointments.filter(apt => apt.status === 'in-progress').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length
    },
    byTherapy: therapies.map(therapy => ({
      name: therapy.name,
      count: appointments.filter(apt => apt.therapy === therapy.name).length
    }))
  }
  
  res.json(stats)
})

export default router


