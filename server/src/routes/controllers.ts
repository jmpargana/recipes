import { Request, Response } from 'express'
import { IRecipe } from '../models/recipe'

const fetchRecipeById = (req: Request, res: Response) => {
  res.send().end()
}

const fetchRecipes = (req: Request, res: Response) => {
  res.send([]).end()
}

const uploadRecipe = (req: Request, res: Response) => {
  const recipe: IRecipe = req.body
  res.status(400).send().end()
}

export {
  fetchRecipeById,
  fetchRecipes,
  uploadRecipe
}
