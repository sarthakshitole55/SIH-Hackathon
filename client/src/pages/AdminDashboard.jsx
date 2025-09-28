import React, { useEffect, useState } from 'react'
import { 
  Box, Grid, Paper, Typography, Button, Card, CardContent, 
  Chip, List, ListItem, ListItemText, ListItemIcon, 
  Divider, LinearProgress, Avatar, Stack, Tab, Tabs
} from '@mui/material'
import { 
  People, LocalHospital, AttachMoney, TrendingUp,
  Schedule, Inventory, PersonAdd, Add, Analytics, 
  BarChart, PieChart, ShowChart, Assessment
} from '@mui/icons-material'
import AyurSidebar from '../components/AyurSidebar'
import WeekCalendar from '../components/WeekCalendar'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [inventory, setInventory] = useState([])
  const [billing, setBilling] = useState([])
  const [billingStats, setBillingStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, appointmentsRes, patientsRes, inventoryRes, billingRes, billingStatsRes] = await Promise.all([
          api.get('/metrics'),
          api.get('/appointments'),
          api.get('/patients'),
          api.get('/inventory'),
          api.get('/billing'),
          api.get('/billing/stats/overview')
        ])
        
        setMetrics(metricsRes.data)
        setAppointments(appointmentsRes.data.appointments || [])
        setPatients(patientsRes.data.patients || [])
        setInventory(inventoryRes.data.inventory || [])
        setBilling(billingRes.data.bills || [])
        setBillingStats(billingStatsRes.data)
        
      } catch (error) {
        console.error('Error fetching data:', error)
        // Enhanced fallback comprehensive data
        setMetrics({
          patients: 247,
          therapiesToday: 18,
          revenueThisMonth: 485000,
          utilization: 78,
          patientStats: { newThisWeek: 23, returning: 189, vip: 35, averageAge: 42 },
          therapyStats: { panchakarma: 8, abhyanga: 12, shirodhara: 6, udwarthana: 4, basti: 3 },
          revenueBreakdown: { consultations: 125000, therapies: 280000, medicines: 65000, packages: 15000 },
          staffStats: { doctors: 4, therapists: 8, nurses: 6, admin: 3 },
          roomUtilization: { therapyRooms: 85, consultationRooms: 70, panchakarmaSuites: 90, waitingArea: 45 },
          monthlyTrends: { 
            jan: { patients: 45, revenue: 180000, appointments: 120 },
            feb: { patients: 52, revenue: 195000, appointments: 135 },
            mar: { patients: 48, revenue: 185000, appointments: 128 },
            apr: { patients: 61, revenue: 220000, appointments: 145 },
            may: { patients: 58, revenue: 210000, appointments: 140 },
            jun: { patients: 55, revenue: 205000, appointments: 138 }
          },
          topTherapies: [
            { name: 'Abhyanga', count: 45, revenue: 67500 },
            { name: 'Panchakarma', count: 28, revenue: 140000 },
            { name: 'Shirodhara', count: 32, revenue: 64000 },
            { name: 'Udwarthana', count: 25, revenue: 37500 },
            { name: 'Basti', count: 18, revenue: 54000 }
          ],
          demographics: {
            ageGroups: { '18-30': 35, '31-45': 42, '46-60': 38, '60+': 25 },
            genderDistribution: { male: 52, female: 48 },
            conditions: { diabetes: 28, hypertension: 35, arthritis: 22, digestive: 18, stress: 31 }
          }
        })
        setBillingStats({
          totalBills: 156,
          totalRevenue: 485000,
          paidRevenue: 420000,
          pendingRevenue: 45000,
          overdueRevenue: 20000,
          paidBills: 142,
          pendingBills: 12,
          overdueBills: 2,
          averageBillAmount: 3109,
          monthlyGrowth: 12.5,
          collectionRate: 86.6
        })
        setAppointments([
          { id: '1', patientName: 'Priya Sharma', therapy: 'Abhyanga', time: '09:00', status: 'confirmed', doctorName: 'Dr. Rajesh Kumar' },
          { id: '2', patientName: 'Amit Patel', therapy: 'Panchakarma', time: '10:30', status: 'confirmed', doctorName: 'Dr. Sunita Reddy' },
          { id: '3', patientName: 'Rajesh Singh', therapy: 'Shirodhara', time: '14:00', status: 'pending', doctorName: 'Dr. Rajesh Kumar' },
          { id: '4', patientName: 'Sunita Gupta', therapy: 'Udwarthana', time: '16:30', status: 'confirmed', doctorName: 'Dr. Sunita Reddy' },
          { id: '5', patientName: 'Vikram Joshi', therapy: 'Basti', time: '11:00', status: 'completed', doctorName: 'Dr. Rajesh Kumar' }
        ])
        setPatients([
          { id: 'P001', name: 'Priya Sharma', age: 35, condition: 'Diabetes', lastVisit: '2024-01-15', status: 'active' },
          { id: 'P002', name: 'Amit Patel', age: 42, condition: 'Hypertension', lastVisit: '2024-01-14', status: 'active' },
          { id: 'P003', name: 'Rajesh Singh', age: 38, condition: 'Arthritis', lastVisit: '2024-01-13', status: 'active' },
          { id: 'P004', name: 'Sunita Gupta', age: 45, condition: 'Digestive Issues', lastVisit: '2024-01-12', status: 'active' },
          { id: 'P005', name: 'Vikram Joshi', age: 50, condition: 'Stress Management', lastVisit: '2024-01-11', status: 'active' }
        ])
        setInventory([
          { id: '1', name: 'Sesame Oil', category: 'Oils', quantity: 15, unit: 'liters', minThreshold: 20, status: 'low-stock' },
          { id: '2', name: 'Brahmi Oil', category: 'Oils', quantity: 8, unit: 'liters', minThreshold: 10, status: 'low-stock' },
          { id: '3', name: 'Herbal Powder Mix', category: 'Powders', quantity: 25, unit: 'kg', minThreshold: 15, status: 'in-stock' },
          { id: '4', name: 'Neem Leaves', category: 'Herbs', quantity: 0, unit: 'kg', minThreshold: 5, status: 'out-of-stock' },
          { id: '5', name: 'Turmeric Powder', category: 'Powders', quantity: 30, unit: 'kg', minThreshold: 20, status: 'in-stock' }
        ])
        setBilling([
          { id: 'B001', patientName: 'Priya Sharma', amount: 2500, status: 'paid', date: '2024-01-15' },
          { id: 'B002', patientName: 'Amit Patel', amount: 4500, status: 'pending', date: '2024-01-14' },
          { id: 'B003', patientName: 'Rajesh Singh', amount: 3200, status: 'paid', date: '2024-01-13' },
          { id: 'B004', patientName: 'Sunita Gupta', amount: 2800, status: 'paid', date: '2024-01-12' },
          { id: 'B005', patientName: 'Vikram Joshi', amount: 5500, status: 'overdue', date: '2024-01-11' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const lowStockItems = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock')
  const todayAppointments = appointments.filter(apt => apt.status === 'confirmed')
  const recentPatients = patients.slice(0, 5)
  const pendingBills = billing.filter(bill => bill.status === 'pending' || bill.status === 'overdue')

  // Chart data processing
  const monthlyData = metrics?.monthlyTrends ? Object.entries(metrics.monthlyTrends).map(([month, data]) => ({
    month: month.charAt(0).toUpperCase() + month.slice(1),
    patients: data.patients,
    revenue: data.revenue,
    appointments: data.appointments
  })) : [
    { month: 'Jan', patients: 45, revenue: 180000, appointments: 120 },
    { month: 'Feb', patients: 52, revenue: 195000, appointments: 135 },
    { month: 'Mar', patients: 48, revenue: 185000, appointments: 128 },
    { month: 'Apr', patients: 61, revenue: 220000, appointments: 145 },
    { month: 'May', patients: 58, revenue: 210000, appointments: 140 },
    { month: 'Jun', patients: 55, revenue: 205000, appointments: 138 }
  ]

  const therapyData = metrics?.topTherapies ? metrics.topTherapies.map(therapy => ({
    name: therapy.name,
    count: therapy.count,
    revenue: therapy.revenue,
    percentage: Math.round((therapy.count / metrics.topTherapies.reduce((sum, t) => sum + t.count, 0)) * 100)
  })) : [
    { name: 'Abhyanga', count: 45, revenue: 67500, percentage: 32 },
    { name: 'Panchakarma', count: 28, revenue: 140000, percentage: 20 },
    { name: 'Shirodhara', count: 32, revenue: 64000, percentage: 23 },
    { name: 'Udwarthana', count: 25, revenue: 37500, percentage: 18 },
    { name: 'Basti', count: 18, revenue: 54000, percentage: 13 }
  ]

  const ageGroupData = metrics?.demographics?.ageGroups ? Object.entries(metrics.demographics.ageGroups).map(([age, count]) => ({
    age,
    count,
    percentage: Math.round((count / Object.values(metrics.demographics.ageGroups).reduce((sum, c) => sum + c, 0)) * 100)
  })) : []

  const SimpleBarChart = ({ data, xKey, yKey, color = 'primary', height = 200 }) => {
    if (!data || data.length === 0) {
      return (
        <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No data available
          </Typography>
        </Box>
      )
    }

    const maxValue = Math.max(...data.map(d => d[yKey]))
    
    return (
      <Box sx={{ height, position: 'relative' }}>
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item[yKey] / maxValue) * 100 : 0
          return (
            <Box key={index} sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {item[xKey]}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {typeof item[yKey] === 'number' ? item[yKey].toLocaleString('en-IN') : item[yKey]}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color === 'primary' ? '#1976d2' : color === 'secondary' ? '#dc004e' : color === 'success' ? '#2e7d32' : '#ed6c02',
                    borderRadius: 6
                  }
                }}
              />
            </Box>
          )
        })}
      </Box>
    )
  }

  const SimplePieChart = ({ data, labelKey, valueKey, colors = ['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#9c27b0'] }) => {
    if (!data || data.length === 0) {
      return (
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No data available
          </Typography>
        </Box>
      )
    }

    const total = data.reduce((sum, item) => sum + item[valueKey], 0)
    
    if (total === 0) {
      return (
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No data available
          </Typography>
        </Box>
      )
    }

    let cumulativePercentage = 0

    return (
      <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
        {/* Pie Chart Container */}
        <Box sx={{ height: 200, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ position: 'relative', width: 160, height: 160 }}>
            {data.map((item, index) => {
              const percentage = (item[valueKey] / total) * 100
              const startAngle = cumulativePercentage * 3.6
              const endAngle = (cumulativePercentage + percentage) * 3.6
              cumulativePercentage += percentage

              // Calculate SVG path for pie slice
              const radius = 70
              const centerX = 80
              const centerY = 80
              
              const startAngleRad = ((startAngle - 90) * Math.PI) / 180
              const endAngleRad = ((endAngle - 90) * Math.PI) / 180
              
              const x1 = centerX + radius * Math.cos(startAngleRad)
              const y1 = centerY + radius * Math.sin(startAngleRad)
              const x2 = centerX + radius * Math.cos(endAngleRad)
              const y2 = centerY + radius * Math.sin(endAngleRad)
              
              const largeArcFlag = percentage > 50 ? 1 : 0
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ')

              return (
                <Box
                  key={index}
                  component="svg"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: index + 1
                  }}
                  viewBox="0 0 160 160"
                >
                  <path
                    d={pathData}
                    fill={colors[index % colors.length]}
                    stroke="white"
                    strokeWidth="3"
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
                  />
                </Box>
              )
            })}
            
            {/* Inner circle to create donut effect */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'white',
                zIndex: data.length + 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {total}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Total
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Legend */}
        <Box sx={{ flex: 1 }}>
          {data.map((item, index) => {
            const percentage = ((item[valueKey] / total) * 100).toFixed(1)
            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: colors[index % colors.length],
                      mr: 1.5,
                      boxShadow: '0px 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {item[labelKey]}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {item[valueKey]}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                    {percentage}%
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    )
  }

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Key Metrics Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Total Patients
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {metrics?.patients || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                +{metrics?.patientStats?.newThisWeek || 0} this week
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <People sx={{ fontSize: 28 }} />
            </Avatar>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Today's Therapies
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {metrics?.therapiesToday || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {todayAppointments.length} confirmed
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <LocalHospital sx={{ fontSize: 28 }} />
            </Avatar>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #dc004e 0%, #f06292 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Monthly Revenue
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                ₹{(metrics?.revenueThisMonth || 0).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                +{billingStats?.monthlyGrowth || 0}% growth
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <AttachMoney sx={{ fontSize: 28 }} />
            </Avatar>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #ed6c02 0%, #ffb74d 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Utilization Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {metrics?.utilization || 0}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Room occupancy
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <TrendingUp sx={{ fontSize: 28 }} />
            </Avatar>
          </Box>
        </Card>
      </Grid>

      {/* Revenue Breakdown Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3, height: 400 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <BarChart sx={{ mr: 1 }} />
            Revenue Breakdown
          </Typography>
          <SimpleBarChart
            data={metrics?.revenueBreakdown ? Object.entries(metrics.revenueBreakdown).map(([category, amount]) => ({
              category,
              amount,
              percentage: Math.round((amount / Object.values(metrics.revenueBreakdown).reduce((sum, val) => sum + val, 0)) * 100)
            })) : [
              { category: 'Consultations', amount: 125000, percentage: 26 },
              { category: 'Therapies', amount: 280000, percentage: 58 },
              { category: 'Medicines', amount: 65000, percentage: 13 },
              { category: 'Packages', amount: 15000, percentage: 3 }
            ]}
            xKey="category"
            yKey="amount"
            color="primary"
            height={300}
          />
        </Card>
      </Grid>

      {/* Top Therapies Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3, height: 500 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PieChart sx={{ mr: 1 }} />
            Top Therapies
          </Typography>
          {therapyData.length > 0 ? (
            <SimplePieChart
              data={therapyData}
              labelKey="name"
              valueKey="count"
              colors={['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#9c27b0']}
            />
          ) : (
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Loading therapy data...
              </Typography>
            </Box>
          )}
        </Card>
      </Grid>

      {/* Monthly Trends Chart */}
      <Grid item xs={12}>
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <ShowChart sx={{ mr: 1 }} />
            Monthly Trends
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Patients</Typography>
              <SimpleBarChart
                data={monthlyData}
                xKey="month"
                yKey="patients"
                color="primary"
                height={200}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Revenue (₹)</Typography>
              <SimpleBarChart
                data={monthlyData}
                xKey="month"
                yKey="revenue"
                color="secondary"
                height={200}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Appointments</Typography>
              <SimpleBarChart
                data={monthlyData}
                xKey="month"
                yKey="appointments"
                color="success"
                height={200}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
      {/* Patient Demographics */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3, height: 500 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Analytics sx={{ mr: 1 }} />
            Age Demographics
          </Typography>
          <SimplePieChart
            data={ageGroupData}
            labelKey="age"
            valueKey="count"
            colors={['#1976d2', '#dc004e', '#2e7d32', '#ed6c02']}
          />
        </Card>
      </Grid>

      {/* Room Utilization */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3, height: 400 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Assessment sx={{ mr: 1 }} />
            Room Utilization
          </Typography>
          {metrics?.roomUtilization && (
            <SimpleBarChart
              data={Object.entries(metrics.roomUtilization).map(([room, utilization]) => ({
                room: room.replace(/([A-Z])/g, ' $1').trim(),
                utilization,
                percentage: utilization
              }))}
              xKey="room"
              yKey="utilization"
              color="secondary"
              height={300}
            />
          )}
        </Card>
      </Grid>

      {/* Staff Statistics */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <People sx={{ mr: 1 }} />
            Staff Statistics
          </Typography>
          {metrics?.staffStats && (
            <Grid container spacing={2}>
              {Object.entries(metrics.staffStats).map(([role, count]) => (
                <Grid item xs={6} key={role}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                      {role}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Card>
      </Grid>

      {/* Billing Statistics */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <AttachMoney sx={{ mr: 1 }} />
            Billing Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 2, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {billingStats?.collectionRate || 0}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Collection Rate
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 2, backgroundColor: 'rgba(25, 118, 210, 0.05)' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ₹{(billingStats?.averageBillAmount || 0).toLocaleString('en-IN')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Avg Bill Amount
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'warning.main', borderRadius: 2, backgroundColor: 'rgba(237, 108, 2, 0.05)' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {billingStats?.pendingBills || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Pending Bills
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'error.main', borderRadius: 2, backgroundColor: 'rgba(211, 47, 47, 0.05)' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {billingStats?.overdueBills || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Overdue Bills
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )

  const renderOperationsTab = () => (
    <Grid container spacing={3}>
      {/* Today's Appointments */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Schedule sx={{ mr: 1 }} />
            Today's Appointments
          </Typography>
          <List>
            {todayAppointments.map((appointment) => (
              <ListItem key={appointment.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {appointment.patientName.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={appointment.patientName}
                  secondary={`${appointment.therapy} at ${appointment.time} - ${appointment.doctorName}`}
                />
                <Chip 
                  label={appointment.status} 
                  color={appointment.status === 'confirmed' ? 'success' : 'warning'}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>

      {/* Recent Patients */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <People sx={{ mr: 1 }} />
            Recent Patients
          </Typography>
          <List>
            {recentPatients.map((patient) => (
              <ListItem key={patient.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {patient.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={patient.name}
                  secondary={`${patient.condition} - Age ${patient.age}`}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {new Date(patient.lastVisit).toLocaleDateString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>

      {/* Inventory Alerts */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Inventory sx={{ mr: 1 }} />
            Inventory Alerts
          </Typography>
          <List>
            {lowStockItems.slice(0, 5).map((item) => (
              <ListItem key={item.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: item.status === 'out-of-stock' ? 'error.main' : 'warning.main' 
                  }}>
                    {item.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  secondary={`${item.quantity} ${item.unit} remaining`}
                />
                <Chip 
                  label={item.status} 
                  color={item.status === 'out-of-stock' ? 'error' : 'warning'}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>

      {/* Pending Bills */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <AttachMoney sx={{ mr: 1 }} />
            Pending Bills
          </Typography>
          <List>
            {pendingBills.slice(0, 5).map((bill) => (
              <ListItem key={bill.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: bill.status === 'overdue' ? 'error.main' : 'warning.main' }}>
                    ₹
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={bill.patientName}
                  secondary={`Amount: ₹${bill.amount.toLocaleString('en-IN')}`}
                />
                <Chip 
                  label={bill.status} 
                  color={bill.status === 'overdue' ? 'error' : 'warning'}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>
    </Grid>
  )

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
      <AyurSidebar />
      <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, mb: 3 }}>
          Admin Dashboard
        </Typography>

        {/* Tabs for different views */}
        <Box sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Analytics" />
            <Tab label="Operations" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && renderOverviewTab()}
        {activeTab === 1 && renderAnalyticsTab()}
        {activeTab === 2 && renderOperationsTab()}

        {/* Calendar Section */}
        <Box sx={{ mb: 4, mt: 4 }}>
          <WeekCalendar />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<Add />}>
            New Appointment
          </Button>
          <Button variant="outlined" startIcon={<PersonAdd />}>
            Add Patient
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Inventory />}
            onClick={() => navigate('/dashboard/inventory')}
          >
            Manage Inventory
          </Button>
          <Button variant="outlined" startIcon={<AttachMoney />}>
            Create Bill
          </Button>
        </Box>
      </Box>
    </Box>
  )
}