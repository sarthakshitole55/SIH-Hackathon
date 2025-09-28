import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    prakriti: { type: String, enum: ['vata', 'pitta', 'kapha', 'mixed'] },
    medicalHistory: { type: String },
  },
  { timestamps: true }
)

export const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema)


