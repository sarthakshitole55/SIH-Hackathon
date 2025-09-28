import express from 'express'

// Comprehensive billing and financial data
const bills = [
  {
    id: 'B001',
    billNumber: 'AYR-2024-001',
    patientId: 'P001',
    patientName: 'Priya Sharma',
    date: '2024-12-20',
    items: [
      { name: 'Abhyanga Therapy', quantity: 1, rate: 3000, amount: 3000 },
      { name: 'Sesame Oil', quantity: 2, rate: 450, amount: 900 },
      { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 }
    ],
    subtotal: 4400,
    tax: 792,
    discount: 0,
    total: 5192,
    status: 'paid',
    paymentMethod: 'UPI',
    doctorName: 'Dr. Rajesh Kumar',
    notes: 'Regular therapy session'
  },
  {
    id: 'B002',
    billNumber: 'AYR-2024-002',
    patientId: 'P002',
    patientName: 'Amit Patel',
    date: '2024-12-20',
    items: [
      { name: 'Panchakarma Package', quantity: 1, rate: 15000, amount: 15000 },
      { name: 'Medicines', quantity: 1, rate: 2500, amount: 2500 },
      { name: 'Follow-up Consultation', quantity: 1, rate: 300, amount: 300 }
    ],
    subtotal: 17800,
    tax: 3204,
    discount: 1000,
    total: 20004,
    status: 'paid',
    paymentMethod: 'Card',
    doctorName: 'Dr. Sunita Reddy',
    notes: 'Detoxification program - day 3'
  },
  {
    id: 'B003',
    billNumber: 'AYR-2024-003',
    patientId: 'P003',
    patientName: 'Sneha Gupta',
    date: '2024-12-21',
    items: [
      { name: 'Shirodhara Therapy', quantity: 1, rate: 2500, amount: 2500 },
      { name: 'Brahmi Oil', quantity: 1, rate: 650, amount: 650 },
      { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 }
    ],
    subtotal: 3650,
    tax: 657,
    discount: 0,
    total: 4307,
    status: 'pending',
    paymentMethod: 'Cash',
    doctorName: 'Dr. Vikram Singh',
    notes: 'Migraine treatment session'
  },
  {
    id: 'B004',
    billNumber: 'AYR-2024-004',
    patientId: 'P004',
    patientName: 'Ravi Kumar',
    date: '2024-12-19',
    items: [
      { name: 'Udwarthana Therapy', quantity: 1, rate: 4000, amount: 4000 },
      { name: 'Herbal Powder Mix', quantity: 2, rate: 800, amount: 1600 },
      { name: 'Weight Management Consultation', quantity: 1, rate: 800, amount: 800 }
    ],
    subtotal: 6400,
    tax: 1152,
    discount: 500,
    total: 7052,
    status: 'paid',
    paymentMethod: 'UPI',
    doctorName: 'Dr. Anjali Mehta',
    notes: 'Weight management program'
  },
  {
    id: 'B005',
    billNumber: 'AYR-2024-005',
    patientId: 'P005',
    patientName: 'Kavita Singh',
    date: '2024-12-18',
    items: [
      { name: 'Basti Therapy', quantity: 1, rate: 3500, amount: 3500 },
      { name: 'Digestive Medicines', quantity: 1, rate: 1200, amount: 1200 },
      { name: 'Follow-up Consultation', quantity: 1, rate: 300, amount: 300 }
    ],
    subtotal: 5000,
    tax: 900,
    discount: 0,
    total: 5900,
    status: 'paid',
    paymentMethod: 'Card',
    doctorName: 'Dr. Rajesh Kumar',
    notes: 'Digestive health treatment'
  },
  {
    id: 'B006',
    billNumber: 'AYR-2024-006',
    patientId: 'P006',
    patientName: 'Mohammed Ali',
    date: '2024-12-17',
    items: [
      { name: 'Abhyanga Therapy', quantity: 1, rate: 3000, amount: 3000 },
      { name: 'Udwarthana Therapy', quantity: 1, rate: 4000, amount: 4000 },
      { name: 'Joint Pain Medicines', quantity: 1, rate: 1500, amount: 1500 },
      { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 }
    ],
    subtotal: 9000,
    tax: 1620,
    discount: 0,
    total: 10620,
    status: 'overdue',
    paymentMethod: 'Cash',
    doctorName: 'Dr. Sunita Reddy',
    notes: 'Arthritis treatment - new patient'
  }
]

const paymentMethods = ['Cash', 'Card', 'UPI', 'Net Banking', 'Cheque']
const billStatuses = ['draft', 'pending', 'paid', 'overdue', 'cancelled']

const router = express.Router()

// Get all bills
router.get('/', (req, res) => {
  const { status, patientId, dateFrom, dateTo } = req.query
  
  let filteredBills = bills
  
  if (status) {
    filteredBills = filteredBills.filter(bill => bill.status === status)
  }
  
  if (patientId) {
    filteredBills = filteredBills.filter(bill => bill.patientId === patientId)
  }
  
  if (dateFrom) {
    filteredBills = filteredBills.filter(bill => bill.date >= dateFrom)
  }
  
  if (dateTo) {
    filteredBills = filteredBills.filter(bill => bill.date <= dateTo)
  }
  
  res.json({ bills: filteredBills })
})

// Get bill by ID
router.get('/:id', (req, res) => {
  const { id } = req.params
  const bill = bills.find(b => b.id === id)
  
  if (!bill) {
    return res.status(404).json({ message: 'Bill not found' })
  }
  
  res.json({ bill })
})

// Get billing statistics
router.get('/stats/overview', (req, res) => {
  const totalBills = bills.length
  const paidBills = bills.filter(b => b.status === 'paid').length
  const pendingBills = bills.filter(b => b.status === 'pending').length
  const overdueBills = bills.filter(b => b.status === 'overdue').length
  
  const totalRevenue = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.total, 0)
  
  const pendingAmount = bills
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + b.total, 0)
  
  const overdueAmount = bills
    .filter(b => b.status === 'overdue')
    .reduce((sum, b) => sum + b.total, 0)
  
  const averageBillValue = totalRevenue / paidBills || 0
  
  res.json({
    totalBills,
    paidBills,
    pendingBills,
    overdueBills,
    totalRevenue,
    pendingAmount,
    overdueAmount,
    averageBillValue
  })
})

// Get revenue analytics
router.get('/stats/revenue', (req, res) => {
  const { period = 'month' } = req.query
  
  // Monthly revenue breakdown
  const monthlyRevenue = [
    { month: 'Aug', revenue: 420000, bills: 45 },
    { month: 'Sep', revenue: 445000, bills: 52 },
    { month: 'Oct', revenue: 430000, bills: 48 },
    { month: 'Nov', revenue: 465000, bills: 55 },
    { month: 'Dec', revenue: 485000, bills: 58 },
    { month: 'Jan', revenue: 0, bills: 0 }
  ]
  
  // Revenue by therapy type
  const therapyRevenue = [
    { therapy: 'Abhyanga', revenue: 135000, count: 45 },
    { therapy: 'Panchakarma', revenue: 180000, count: 12 },
    { therapy: 'Shirodhara', revenue: 84000, count: 28 },
    { therapy: 'Udwarthana', revenue: 45000, count: 15 },
    { therapy: 'Basti', revenue: 40000, count: 8 }
  ]
  
  // Payment method distribution
  const paymentDistribution = {
    'UPI': 45,
    'Card': 30,
    'Cash': 20,
    'Net Banking': 5
  }
  
  res.json({
    monthlyRevenue,
    therapyRevenue,
    paymentDistribution
  })
})

// Create new bill
router.post('/', (req, res) => {
  const { patientId, items, doctorName, notes } = req.body
  
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + tax - (req.body.discount || 0)
  
  const newBill = {
    id: `B${String(bills.length + 1).padStart(3, '0')}`,
    billNumber: `AYR-2024-${String(bills.length + 1).padStart(3, '0')}`,
    patientId,
    patientName: req.body.patientName,
    date: new Date().toISOString().split('T')[0],
    items,
    subtotal,
    tax,
    discount: req.body.discount || 0,
    total,
    status: 'draft',
    paymentMethod: req.body.paymentMethod || 'Cash',
    doctorName,
    notes: notes || ''
  }
  
  bills.push(newBill)
  res.status(201).json({ bill: newBill })
})

// Update bill
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = bills.findIndex(b => b.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Bill not found' })
  }
  
  bills[index] = { ...bills[index], ...req.body }
  res.json({ bill: bills[index] })
})

// Get billing statistics
router.get('/stats/overview', (req, res) => {
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0)
  const paidBills = bills.filter(bill => bill.status === 'paid')
  const pendingBills = bills.filter(bill => bill.status === 'pending')
  const overdueBills = bills.filter(bill => bill.status === 'overdue')
  
  const paidRevenue = paidBills.reduce((sum, bill) => sum + bill.total, 0)
  const pendingRevenue = pendingBills.reduce((sum, bill) => sum + bill.total, 0)
  const overdueRevenue = overdueBills.reduce((sum, bill) => sum + bill.total, 0)
  
  const paymentMethodStats = {}
  const doctorStats = {}
  const monthlyRevenue = {}
  
  bills.forEach(bill => {
    // Payment method stats
    paymentMethodStats[bill.paymentMethod] = (paymentMethodStats[bill.paymentMethod] || 0) + 1
    
    // Doctor stats
    doctorStats[bill.doctorName] = (doctorStats[bill.doctorName] || 0) + bill.total
    
    // Monthly revenue
    const month = bill.date.substring(0, 7) // YYYY-MM
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + bill.total
  })
  
  res.json({
    totalBills: bills.length,
    totalRevenue,
    paidRevenue,
    pendingRevenue,
    overdueRevenue,
    paidBills: paidBills.length,
    pendingBills: pendingBills.length,
    overdueBills: overdueBills.length,
    paymentMethodStats,
    doctorStats,
    monthlyRevenue,
    averageBillAmount: Math.round(totalRevenue / bills.length)
  })
})

// Get master data
router.get('/master-data', (req, res) => {
  res.json({
    paymentMethods,
    billStatuses
  })
})

export default router
