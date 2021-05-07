import mongoose from "mongoose"

interface IUser extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

export const Users = mongoose.model<IUser>("Users", userSchema)
