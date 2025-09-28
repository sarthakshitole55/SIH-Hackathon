import React, { useEffect, useState } from 'react'
import { 
  Box, Grid, Card, Typography, Button, List, ListItem, ListItemText, 
  ListItemIcon, Avatar, Chip, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import { 
  Receipt, Payment, Download, Print, Visibility, 
  CheckCircle, Pending, Error, CreditCard, AccountBalanceWallet
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function MyBills() {
  const { user } = useAuth()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const billingRes = await api.get('/billing')
        
        // Filter for current patient
        const patientBills = billingRes.data.bills?.filter(bill => 
          bill.patientId === 'P001' || bill.patientName === 'Priya Sharma'
        ) || []

        setBills(patientBills)
      } catch (error) {
        console.error('Error fetching bills:', error)
        // Fallback data
        setBills([
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
            patientId: 'P001',
            patientName: 'Priya Sharma',
            date: '2024-12-15',
            items: [
              { name: 'Shirodhara Therapy', quantity: 1, rate: 2500, amount: 2500 },
              { name: 'Brahmi Oil', quantity: 1, rate: 650, amount: 650 },
              { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 }
            ],
            subtotal: 3650,
            tax: 657,
            discount: 0,
            total: 4307,
            status: 'paid',
            paymentMethod: 'Card',
            doctorName: 'Dr. Rajesh Kumar',
            notes: 'Migraine treatment session'
          },
          {
            id: 'B003',
            billNumber: 'AYR-2024-003',
            patientId: 'P001',
            patientName: 'Priya Sharma',
            date: '2024-12-10',
            items: [
              { name: 'Abhyanga Therapy', quantity: 2, rate: 3000, amount: 6000 },
              { name: 'Sesame Oil', quantity: 3, rate: 450, amount: 1350 },
              { name: 'Follow-up Consultation', quantity: 1, rate: 300, amount: 300 }
            ],
            subtotal: 7650,
            tax: 1377,
            discount: 500,
            total: 8527,
            status: 'paid',
            paymentMethod: 'UPI',
            doctorName: 'Dr. Rajesh Kumar',
            notes: 'Two therapy sessions'
          },
          {
            id: 'B004',
            billNumber: 'AYR-2024-004',
            patientId: 'P001',
            patientName: 'Priya Sharma',
            date: '2024-12-05',
            items: [
              { name: 'Nasya Therapy', quantity: 1, rate: 1500, amount: 1500 },
              { name: 'Nasal Oil', quantity: 1, rate: 350, amount: 350 },
              { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 }
            ],
            subtotal: 2350,
            tax: 423,
            discount: 0,
            total: 2773,
            status: 'pending',
            paymentMethod: 'Cash',
            doctorName: 'Dr. Rajesh Kumar',
            notes: 'Sinus treatment session'
          },
          {
            id: 'B005',
            billNumber: 'AYR-2024-005',
            patientId: 'P001',
            patientName: 'Priya Sharma',
            date: '2024-11-28',
            items: [
              { name: 'Panchakarma Package', quantity: 1, rate: 8000, amount: 8000 },
              { name: 'Medicines', quantity: 1, rate: 1200, amount: 1200 },
              { name: 'Follow-up Consultation', quantity: 1, rate: 300, amount: 300 }
            ],
            subtotal: 9500,
            tax: 1710,
            discount: 1000,
            total: 10210,
            status: 'paid',
            paymentMethod: 'Card',
            doctorName: 'Dr. Sunita Reddy',
            notes: 'Panchakarma detoxification program'
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const paidBills = bills.filter(bill => bill.status === 'paid')
  const pendingBills = bills.filter(bill => bill.status === 'pending')
  const totalSpent = paidBills.reduce((sum, bill) => sum + bill.total, 0)
  const pendingAmount = pendingBills.reduce((sum, bill) => sum + bill.total, 0)

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'overdue': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle />
      case 'pending': return <Pending />
      case 'overdue': return <Error />
      default: return <Receipt />
    }
  }

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'upi': return <AccountBalanceWallet />
      case 'card': return <CreditCard />
      case 'cash': return <Payment />
      default: return <Payment />
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
        <AyurSidebar />
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Loading your bills...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
      <AyurSidebar />
      <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, mb: 3 }}>
          My Bills
        </Typography>

        {/* Bill Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
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
                {paidBills.length} bills paid
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Pending />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Pending Amount
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{pendingAmount.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'warning.main' }}>
                {pendingBills.length} bills pending
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Receipt />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Total Bills
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {bills.length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                All time bills
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="shimmer-card" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Payment />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Avg. Bill Amount
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{Math.round(bills.reduce((sum, bill) => sum + bill.total, 0) / bills.length).toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'secondary.main' }}>
                Per session cost
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Bills List */}
        <Card sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Bills
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bill Number</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {bill.billNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {bill.items.length} items
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {bill.items[0]?.name}
                          {bill.items.length > 1 && ` +${bill.items.length - 1} more`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{bill.total.toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getStatusIcon(bill.status)}
                          label={bill.status} 
                          color={getStatusColor(bill.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getPaymentIcon(bill.paymentMethod)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {bill.paymentMethod}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" startIcon={<Visibility />}>
                            View
                          </Button>
                          <Button size="small" startIcon={<Download />}>
                            Download
                          </Button>
                          <Button size="small" startIcon={<Print />}>
                            Print
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>

        {/* Payment Methods Summary */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Methods Used
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">UPI</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {bills.filter(b => b.paymentMethod === 'UPI').length} bills
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CreditCard sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="body2">Card</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {bills.filter(b => b.paymentMethod === 'Card').length} bills
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Payment sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="body2">Cash</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {bills.filter(b => b.paymentMethod === 'Cash').length} bills
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Monthly Spending
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">December 2024</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{(totalSpent + pendingAmount).toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">November 2024</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹10,210
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">October 2024</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹8,500
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Average Monthly</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹7,500
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
