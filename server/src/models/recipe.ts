import mongoose from 'mongoose'
import { User } from './user'

export interface Recipe extends mongoose.Document {
  userId: User['_id']
  title: string
  ingridients: string[]
  method: string
  time: number
  hidden: boolean
  tags: string[]
}

export const isRecipe = (r: Recipe): r is Recipe =>
  r?.title && r?.userId && r?.ingridients?.length > 0 && r?.method && r?.time && r?.tags?.length > 0

const RecipeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  ingridients: [String],
  method: String,
  time: Number,
  hidden: Boolean,
  tags: [String]
})

export default mongoose.model<Recipe>('Recipe', RecipeSchema)
