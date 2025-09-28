import mongoose from 'mongoose'

const roles = ['patient', 'therapist', 'admin']

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: roles, default: 'patient', index: true }
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const USER_ROLES = roles


