import mongoose from 'mongoose'

interface User extends mongoose.Document {
  email: string
  password: string
}

const isUser = (u: User): u is User =>
  !!u && !!u.email && !!u.password

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true, bcrypt: true }
})

const Users = mongoose.model<User>('Users', UserSchema)

export {
  User,
  isUser,
  Users
}
