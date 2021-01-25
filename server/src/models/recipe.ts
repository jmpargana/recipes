import mongoose from 'mongoose'
import { IUser } from './user'

type Ingridient = string
type Tag = string

export interface IRecipe extends mongoose.Document {
  userId: IUser['_id']
  title: string
  ingridients: Ingridient[]
  method: string
  time: number
  hidden: boolean
  tags: Tag[]
}

const RecipeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  ingridients: [String],
  method: String,
  time: Number,
  hidden: Boolean,
  tags: [String]
})

export default mongoose.model<IRecipe>('Recipe', RecipeSchema)
