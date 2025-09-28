import express from 'express'

// Comprehensive Ayurveda clinic dataset
const state = {
  // Core metrics
  patients: 247,
  therapiesToday: 18,
  revenueThisMonth: 485000, // in INR
  utilization: 78, // percent
  
  // Detailed breakdowns
  patientStats: {
    newThisWeek: 23,
    returning: 189,
    vip: 35,
    averageAge: 42
  },
  
  therapyStats: {
    panchakarma: 8,
    abhyanga: 12,
    shirodhara: 6,
    udwarthana: 4,
    basti: 3
  },
  
  revenueBreakdown: {
    consultations: 125000,
    therapies: 280000,
    medicines: 65000,
    packages: 15000
  },
  
  // Staff metrics
  staffStats: {
    doctors: 4,
    therapists: 8,
    nurses: 6,
    admin: 3
  },
  
  // Room utilization
  roomUtilization: {
    therapyRooms: 85,
    consultationRooms: 70,
    panchakarmaSuites: 90,
    waitingArea: 45
  },
  
  // Monthly trends (last 6 months)
  monthlyTrends: [
    { month: 'Aug', patients: 198, revenue: 420000 },
    { month: 'Sep', patients: 215, revenue: 445000 },
    { month: 'Oct', patients: 203, revenue: 430000 },
    { month: 'Nov', patients: 231, revenue: 465000 },
    { month: 'Dec', patients: 247, revenue: 485000 },
    { month: 'Jan', patients: 0, revenue: 0 } // Current month
  ],
  
  // Top performing therapies
  topTherapies: [
    { name: 'Abhyanga', count: 45, revenue: 135000 },
    { name: 'Panchakarma', count: 12, revenue: 180000 },
    { name: 'Shirodhara', count: 28, revenue: 84000 },
    { name: 'Udwarthana', count: 15, revenue: 45000 },
    { name: 'Basti', count: 8, revenue: 40000 }
  ],
  
  // Patient demographics
  demographics: {
    ageGroups: {
      '18-30': 45,
      '31-45': 89,
      '46-60': 78,
      '60+': 35
    },
    gender: {
      male: 112,
      female: 135
    },
    conditions: {
      'Digestive Issues': 67,
      'Stress & Anxiety': 54,
      'Joint Problems': 43,
      'Skin Conditions': 38,
      'Respiratory': 29,
      'Sleep Disorders': 16
    }
  }
}

const router = express.Router()

// Main metrics endpoint
router.get('/', (req, res) => {
  res.json({
    patients: state.patients,
    therapiesToday: state.therapiesToday,
    revenueThisMonth: state.revenueThisMonth,
    utilization: state.utilization,
    patientStats: state.patientStats,
    therapyStats: state.therapyStats,
    revenueBreakdown: state.revenueBreakdown,
    staffStats: state.staffStats,
    roomUtilization: state.roomUtilization
  })
})

// Detailed analytics endpoints
router.get('/analytics', (req, res) => {
  res.json({
    monthlyTrends: state.monthlyTrends,
    topTherapies: state.topTherapies,
    demographics: state.demographics
  })
})

// Revenue analytics
router.get('/revenue', (req, res) => {
  res.json({
    current: state.revenueThisMonth,
    breakdown: state.revenueBreakdown,
    trends: state.monthlyTrends
  })
})

// Patient analytics
router.get('/patients', (req, res) => {
  res.json({
    total: state.patients,
    stats: state.patientStats,
    demographics: state.demographics
  })
})

// Therapy analytics
router.get('/therapies', (req, res) => {
  res.json({
    today: state.therapiesToday,
    stats: state.therapyStats,
    topPerforming: state.topTherapies
  })
})

export default router


