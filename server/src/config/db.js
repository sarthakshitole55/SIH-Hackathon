import mongoose from 'mongoose'

export async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    console.warn('MONGO_URI not set. Skipping MongoDB connection (running in API-only mode).')
    return
  }
  try {
    await mongoose.connect(mongoUri, { autoIndex: true })
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
  }
}


