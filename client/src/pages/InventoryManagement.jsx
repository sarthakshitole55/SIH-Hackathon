import React, { useEffect, useState } from 'react'
import { 
  Box, Grid, Card, CardContent, Typography, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, Avatar, IconButton, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { 
  Search, Add, Edit, Delete, Inventory, 
  Warning, CheckCircle, Cancel, LocalShipping
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory')
      setInventory(response.data.inventory || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
      // Fallback data
      setInventory([
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
          name: 'Neem Leaves',
          category: 'Herbs',
          quantity: 0,
          unit: 'kg',
          minThreshold: 1,
          price: 200,
          supplier: 'Green Herbs Co',
          expiryDate: '2025-02-28',
          status: 'out-of-stock'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    const matchesStatus = !selectedStatus || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'success'
      case 'low-stock': return 'warning'
      case 'out-of-stock': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-stock': return <CheckCircle />
      case 'low-stock': return <Warning />
      case 'out-of-stock': return <Cancel />
      default: return <Inventory />
    }
  }

  const categories = [...new Set(inventory.map(item => item.category))]
  const totalItems = inventory.length
  const lowStockItems = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
      <AyurSidebar />
      <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, mb: 3 }}>
          Inventory Management
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Inventory />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Total Items
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalItems}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {lowStockItems}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    In Stock Items
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalItems - lowStockItems}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <LocalShipping />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Total Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{totalValue.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search inventory..."
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="in-stock">In Stock</MenuItem>
                  <MenuItem value="low-stock">Low Stock</MenuItem>
                  <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                onClick={() => setOpenDialog(true)}
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Inventory Table */}
        <Card sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Threshold</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Expiry</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {item.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.quantity} {item.unit}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.minThreshold} {item.unit}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(item.status)}
                        label={item.status.replace('-', ' ').toUpperCase()}
                        color={getStatusColor(item.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => setEditingItem(item)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog || !!editingItem} onClose={() => { setOpenDialog(false); setEditingItem(null) }} maxWidth="md" fullWidth>
          <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Inventory management form will be implemented here
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenDialog(false); setEditingItem(null) }}>Cancel</Button>
            <Button variant="contained">{editingItem ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
