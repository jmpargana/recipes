import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  email: string
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
})

export default mongoose.model<IUser>('User', UserSchema)
