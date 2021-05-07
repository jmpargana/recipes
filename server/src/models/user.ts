import mongoose from 'mongoose'

interface User extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

const Users = mongoose.model<User>('Users', userSchema)

const isUser = (u: User): u is User => !!u && !!u.email && !!u.password

export { User, isUser, Users }
