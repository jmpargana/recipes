import mongoose from 'mongoose'

export interface User extends mongoose.Document {
  email: string
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
})

export default mongoose.model<User>('User', UserSchema)
