import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectToDatabase } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import metricsRoutes from './routes/metrics.routes.js'
import appointmentsRoutes from './routes/appointments.routes.js'
import inventoryRoutes from './routes/inventory.routes.js'
import patientsRoutes from './routes/patients.routes.js'
import billingRoutes from './routes/billing.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AyurSutra API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/metrics', metricsRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/patients', patientsRoutes)
app.use('/api/billing', billingRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, async () => {
  if (process.env.MONGO_URI) {
    await connectToDatabase(process.env.MONGO_URI)
  } else {
    console.log('MONGO_URI not set. Running in API-only mode with in-memory storage.')
  }
  console.log(`API listening on http://localhost:${PORT}`)
})


