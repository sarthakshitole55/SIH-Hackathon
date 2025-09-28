import express from 'express'

// Comprehensive inventory dataset for Ayurveda clinic
const inventory = [
  {
    id: '1',
    name: 'Sesame Oil (Til Tail)',
    category: 'Oils',
    quantity: 25,
    unit: 'liters',
    minThreshold: 5,
    price: 450,
    supplier: 'Herbal Solutions Pvt Ltd',
    expiryDate: '2025-06-15',
    status: 'in-stock'
  },
  {
    id: '2',
    name: 'Coconut Oil (Nariyal Tail)',
    category: 'Oils',
    quantity: 18,
    unit: 'liters',
    minThreshold: 3,
    price: 380,
    supplier: 'Natural Oils Co',
    expiryDate: '2025-08-20',
    status: 'in-stock'
  },
  {
    id: '3',
    name: 'Ashwagandha Powder',
    category: 'Herbs',
    quantity: 2,
    unit: 'kg',
    minThreshold: 1,
    price: 1200,
    supplier: 'Ayurvedic Herbs Ltd',
    expiryDate: '2025-03-10',
    status: 'low-stock'
  },
  {
    id: '4',
    name: 'Triphala Powder',
    category: 'Herbs',
    quantity: 5,
    unit: 'kg',
    minThreshold: 2,
    price: 800,
    supplier: 'Herbal Solutions Pvt Ltd',
    expiryDate: '2025-05-25',
    status: 'in-stock'
  },
  {
    id: '5',
    name: 'Cotton Sheets',
    category: 'Supplies',
    quantity: 50,
    unit: 'pieces',
    minThreshold: 10,
    price: 150,
    supplier: 'Medical Supplies Inc',
    expiryDate: null,
    status: 'in-stock'
  },
  {
    id: '6',
    name: 'Basti Equipment Set',
    category: 'Equipment',
    quantity: 3,
    unit: 'sets',
    minThreshold: 1,
    price: 2500,
    supplier: 'Ayurvedic Equipment Co',
    expiryDate: null,
    status: 'in-stock'
  },
  {
    id: '7',
    name: 'Shirodhara Pot',
    category: 'Equipment',
    quantity: 0,
    unit: 'pieces',
    minThreshold: 2,
    price: 1800,
    supplier: 'Traditional Tools Ltd',
    expiryDate: null,
    status: 'out-of-stock'
  },
  {
    id: '8',
    name: 'Brahmi Oil',
    category: 'Oils',
    quantity: 1,
    unit: 'liters',
    minThreshold: 2,
    price: 650,
    supplier: 'Herbal Solutions Pvt Ltd',
    expiryDate: '2025-04-12',
    status: 'low-stock'
  }
]

const categories = [
  'Oils', 'Herbs', 'Supplies', 'Equipment', 'Medicines', 'Instruments'
]

const suppliers = [
  'Herbal Solutions Pvt Ltd',
  'Natural Oils Co',
  'Ayurvedic Herbs Ltd',
  'Medical Supplies Inc',
  'Ayurvedic Equipment Co',
  'Traditional Tools Ltd'
]

const router = express.Router()

// Get all inventory items
router.get('/', (req, res) => {
  const { category, status, lowStock } = req.query
  
  let filteredInventory = inventory
  
  if (category) {
    filteredInventory = filteredInventory.filter(item => item.category === category)
  }
  
  if (status) {
    filteredInventory = filteredInventory.filter(item => item.status === status)
  }
  
  if (lowStock === 'true') {
    filteredInventory = filteredInventory.filter(item => item.quantity <= item.minThreshold)
  }
  
  res.json({ inventory: filteredInventory })
})

// Get inventory statistics
router.get('/stats', (req, res) => {
  const totalItems = inventory.length
  const lowStockItems = inventory.filter(item => item.quantity <= item.minThreshold).length
  const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  
  const categoryBreakdown = categories.map(category => ({
    category,
    count: inventory.filter(item => item.category === category).length,
    value: inventory
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }))
  
  res.json({
    totalItems,
    lowStockItems,
    outOfStockItems,
    totalValue,
    categoryBreakdown
  })
})

// Get low stock alerts
router.get('/alerts', (req, res) => {
  const lowStockItems = inventory.filter(item => item.quantity <= item.minThreshold)
  const expiringSoon = inventory.filter(item => {
    if (!item.expiryDate) return false
    const expiry = new Date(item.expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiry <= thirtyDaysFromNow
  })
  
  res.json({
    lowStock: lowStockItems,
    expiringSoon,
    alerts: [
      ...lowStockItems.map(item => ({
        type: 'low-stock',
        message: `${item.name} is running low (${item.quantity} ${item.unit} remaining)`,
        itemId: item.id,
        priority: 'high'
      })),
      ...expiringSoon.map(item => ({
        type: 'expiry',
        message: `${item.name} expires on ${item.expiryDate}`,
        itemId: item.id,
        priority: 'medium'
      }))
    ]
  })
})

// Add new inventory item
router.post('/', (req, res) => {
  const newItem = {
    id: String(Date.now()),
    ...req.body,
    status: req.body.quantity > 0 ? 'in-stock' : 'out-of-stock'
  }
  
  inventory.push(newItem)
  res.status(201).json(newItem)
})

// Update inventory item
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = inventory.findIndex(item => item.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' })
  }
  
  const updatedItem = { ...inventory[index], ...req.body }
  
  // Update status based on quantity
  if (updatedItem.quantity <= 0) {
    updatedItem.status = 'out-of-stock'
  } else if (updatedItem.quantity <= updatedItem.minThreshold) {
    updatedItem.status = 'low-stock'
  } else {
    updatedItem.status = 'in-stock'
  }
  
  inventory[index] = updatedItem
  res.json(updatedItem)
})

// Get master data
router.get('/master-data', (req, res) => {
  res.json({
    categories,
    suppliers
  })
})

export default router
