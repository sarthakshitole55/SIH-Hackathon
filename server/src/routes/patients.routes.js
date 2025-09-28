import express from 'express'

// Comprehensive patient dataset
const patients = [
  {
    id: 'P001',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543210',
    age: 34,
    gender: 'female',
    address: '123 MG Road, Bangalore',
    emergencyContact: '+91-9876543211',
    medicalHistory: ['Hypertension', 'Stress'],
    allergies: ['Peanuts'],
    registrationDate: '2024-01-15',
    lastVisit: '2024-12-20',
    totalVisits: 12,
    status: 'active',
    doctor: 'Dr. Rajesh Kumar',
    therapyHistory: ['Abhyanga', 'Shirodhara'],
    notes: 'Regular patient, responds well to oil therapies'
  },
  {
    id: 'P002',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91-9876543212',
    age: 42,
    gender: 'male',
    address: '456 Koramangala, Bangalore',
    emergencyContact: '+91-9876543213',
    medicalHistory: ['Diabetes', 'Digestive Issues'],
    allergies: [],
    registrationDate: '2024-02-10',
    lastVisit: '2024-12-22',
    totalVisits: 8,
    status: 'active',
    doctor: 'Dr. Sunita Reddy',
    therapyHistory: ['Panchakarma', 'Basti'],
    notes: 'Undergoing detoxification program'
  },
  {
    id: 'P003',
    name: 'Sneha Gupta',
    email: 'sneha.gupta@email.com',
    phone: '+91-9876543214',
    age: 28,
    gender: 'female',
    address: '789 Indiranagar, Bangalore',
    emergencyContact: '+91-9876543215',
    medicalHistory: ['Migraine', 'Anxiety'],
    allergies: ['Dust'],
    registrationDate: '2024-03-05',
    lastVisit: '2024-12-21',
    totalVisits: 15,
    status: 'active',
    doctor: 'Dr. Vikram Singh',
    therapyHistory: ['Shirodhara', 'Abhyanga'],
    notes: 'Migraine treatment showing good results'
  },
  {
    id: 'P004',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@email.com',
    phone: '+91-9876543216',
    age: 38,
    gender: 'male',
    address: '321 Whitefield, Bangalore',
    emergencyContact: '+91-9876543217',
    medicalHistory: ['Obesity', 'Joint Pain'],
    allergies: [],
    registrationDate: '2024-04-12',
    lastVisit: '2024-12-19',
    totalVisits: 6,
    status: 'active',
    doctor: 'Dr. Anjali Mehta',
    therapyHistory: ['Udwarthana', 'Abhyanga'],
    notes: 'Weight management program in progress'
  },
  {
    id: 'P005',
    name: 'Kavita Singh',
    email: 'kavita.singh@email.com',
    phone: '+91-9876543218',
    age: 45,
    gender: 'female',
    address: '654 Jayanagar, Bangalore',
    emergencyContact: '+91-9876543219',
    medicalHistory: ['Digestive Issues', 'Insomnia'],
    allergies: ['Lactose'],
    registrationDate: '2024-05-20',
    lastVisit: '2024-12-18',
    totalVisits: 10,
    status: 'active',
    doctor: 'Dr. Rajesh Kumar',
    therapyHistory: ['Basti', 'Abhyanga'],
    notes: 'Digestive health improving'
  },
  {
    id: 'P006',
    name: 'Mohammed Ali',
    email: 'mohammed.ali@email.com',
    phone: '+91-9876543220',
    age: 52,
    gender: 'male',
    address: '987 Malleswaram, Bangalore',
    emergencyContact: '+91-9876543221',
    medicalHistory: ['Arthritis', 'High Blood Pressure'],
    allergies: [],
    registrationDate: '2024-06-08',
    lastVisit: '2024-12-17',
    totalVisits: 4,
    status: 'active',
    doctor: 'Dr. Sunita Reddy',
    therapyHistory: ['Abhyanga', 'Udwarthana'],
    notes: 'New patient, arthritis treatment'
  },
  {
    id: 'P007',
    name: 'Deepika Reddy',
    email: 'deepika.reddy@email.com',
    phone: '+91-9876543222',
    age: 29,
    gender: 'female',
    address: '456 HSR Layout, Bangalore',
    emergencyContact: '+91-9876543223',
    medicalHistory: ['Sinusitis', 'Allergic Rhinitis'],
    allergies: ['Pollen', 'Dust Mites'],
    registrationDate: '2024-07-15',
    lastVisit: '2024-12-20',
    totalVisits: 8,
    status: 'active',
    doctor: 'Dr. Rajesh Kumar',
    therapyHistory: ['Nasya', 'Abhyanga'],
    notes: 'Sinus treatment with good response'
  },
  {
    id: 'P008',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@email.com',
    phone: '+91-9876543223',
    age: 45,
    gender: 'male',
    address: '789 Electronic City, Bangalore',
    emergencyContact: '+91-9876543224',
    medicalHistory: ['Chronic Fatigue', 'Sleep Disorders'],
    allergies: [],
    registrationDate: '2024-08-20',
    lastVisit: '2024-12-19',
    totalVisits: 5,
    status: 'active',
    doctor: 'Dr. Sunita Reddy',
    therapyHistory: ['Abhyanga', 'Shirodhara'],
    notes: 'Work stress related issues'
  },
  {
    id: 'P009',
    name: 'Anita Desai',
    email: 'anita.desai@email.com',
    phone: '+91-9876543224',
    age: 38,
    gender: 'female',
    address: '321 Banashankari, Bangalore',
    emergencyContact: '+91-9876543225',
    medicalHistory: ['Skin Conditions', 'Hormonal Imbalance'],
    allergies: ['Synthetic Fragrances'],
    registrationDate: '2024-09-10',
    lastVisit: '2024-12-21',
    totalVisits: 7,
    status: 'active',
    doctor: 'Dr. Vikram Singh',
    therapyHistory: ['Virechana', 'Abhyanga'],
    notes: 'Detoxification for skin health'
  },
  {
    id: 'P010',
    name: 'Rajesh Mehta',
    email: 'rajesh.mehta@email.com',
    phone: '+91-9876543225',
    age: 41,
    gender: 'male',
    address: '654 Marathahalli, Bangalore',
    emergencyContact: '+91-9876543226',
    medicalHistory: ['Metabolic Syndrome', 'High Cholesterol'],
    allergies: [],
    registrationDate: '2024-10-05',
    lastVisit: '2024-12-22',
    totalVisits: 6,
    status: 'active',
    doctor: 'Dr. Anjali Mehta',
    therapyHistory: ['Udwarthana', 'Basti'],
    notes: 'Weight loss and metabolic health'
  },
  {
    id: 'P011',
    name: 'Sunita Agarwal',
    email: 'sunita.agarwal@email.com',
    phone: '+91-9876543226',
    age: 33,
    gender: 'female',
    address: '987 Rajajinagar, Bangalore',
    emergencyContact: '+91-9876543227',
    medicalHistory: ['PCOS', 'Irregular Menstruation'],
    allergies: ['Dairy'],
    registrationDate: '2024-11-12',
    lastVisit: '2024-12-18',
    totalVisits: 4,
    status: 'active',
    doctor: 'Dr. Rajesh Kumar',
    therapyHistory: ['Shirodhara', 'Abhyanga'],
    notes: 'Women\'s health and hormonal balance'
  },
  {
    id: 'P012',
    name: 'Arjun Singh',
    email: 'arjun.singh@email.com',
    phone: '+91-9876543227',
    age: 36,
    gender: 'male',
    address: '123 Ulsoor, Bangalore',
    emergencyContact: '+91-9876543228',
    medicalHistory: ['Asthma', 'Respiratory Issues'],
    allergies: ['Smoke', 'Cold Air'],
    registrationDate: '2024-12-01',
    lastVisit: '2024-12-17',
    totalVisits: 3,
    status: 'active',
    doctor: 'Dr. Sunita Reddy',
    therapyHistory: ['Vamana', 'Abhyanga'],
    notes: 'Respiratory health improvement'
  }
]

const router = express.Router()

// Get all patients
router.get('/', (req, res) => {
  const { status, doctor, search } = req.query
  
  let filteredPatients = patients
  
  if (status) {
    filteredPatients = filteredPatients.filter(patient => patient.status === status)
  }
  
  if (doctor) {
    filteredPatients = filteredPatients.filter(patient => 
      patient.doctor.toLowerCase().includes(doctor.toLowerCase())
    )
  }
  
  if (search) {
    filteredPatients = filteredPatients.filter(patient =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search)
    )
  }
  
  res.json({ patients: filteredPatients })
})

// Get patient by ID
router.get('/:id', (req, res) => {
  const { id } = req.params
  const patient = patients.find(p => p.id === id)
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' })
  }
  
  res.json({ patient })
})

// Get patient statistics
router.get('/stats/overview', (req, res) => {
  const totalPatients = patients.length
  const activePatients = patients.filter(p => p.status === 'active').length
  const newThisMonth = patients.filter(p => {
    const regDate = new Date(p.registrationDate)
    const now = new Date()
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear()
  }).length
  
  const averageAge = Math.round(
    patients.reduce((sum, p) => sum + p.age, 0) / patients.length
  )
  
  const genderDistribution = {
    male: patients.filter(p => p.gender === 'male').length,
    female: patients.filter(p => p.gender === 'female').length
  }
  
  const ageGroups = {
    '18-30': patients.filter(p => p.age >= 18 && p.age <= 30).length,
    '31-45': patients.filter(p => p.age >= 31 && p.age <= 45).length,
    '46-60': patients.filter(p => p.age >= 46 && p.age <= 60).length,
    '60+': patients.filter(p => p.age > 60).length
  }
  
  res.json({
    totalPatients,
    activePatients,
    newThisMonth,
    averageAge,
    genderDistribution,
    ageGroups
  })
})

// Get patient demographics
router.get('/stats/demographics', (req, res) => {
  const conditions = {}
  const therapies = {}
  
  patients.forEach(patient => {
    // Count conditions
    patient.medicalHistory.forEach(condition => {
      conditions[condition] = (conditions[condition] || 0) + 1
    })
    
    // Count therapies
    patient.therapyHistory.forEach(therapy => {
      therapies[therapy] = (therapies[therapy] || 0) + 1
    })
  })
  
  res.json({
    conditions: Object.entries(conditions)
      .map(([condition, count]) => ({ condition, count }))
      .sort((a, b) => b.count - a.count),
    therapies: Object.entries(therapies)
      .map(([therapy, count]) => ({ therapy, count }))
      .sort((a, b) => b.count - a.count)
  })
})

// Add new patient
router.post('/', (req, res) => {
  const newPatient = {
    id: `P${String(patients.length + 1).padStart(3, '0')}`,
    ...req.body,
    registrationDate: new Date().toISOString().split('T')[0],
    totalVisits: 0,
    status: 'active',
    therapyHistory: []
  }
  
  patients.push(newPatient)
  res.status(201).json({ patient: newPatient })
})

// Update patient
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = patients.findIndex(p => p.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' })
  }
  
  patients[index] = { ...patients[index], ...req.body }
  res.json({ patient: patients[index] })
})

// Get patient's appointment history
router.get('/:id/appointments', (req, res) => {
  const { id } = req.params
  const patient = patients.find(p => p.id === id)
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' })
  }
  
  // This would typically come from appointments API
  // For now, return mock data
  const appointments = [
    {
      id: '1',
      date: '2024-12-20',
      time: '09:00',
      therapy: 'Abhyanga',
      doctor: patient.doctor,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-12-15',
      time: '14:00',
      therapy: 'Shirodhara',
      doctor: patient.doctor,
      status: 'completed'
    }
  ]
  
  res.json({ appointments })
})

export default router
