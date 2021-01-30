import { Request, Response } from 'express'
import Recipes, { Recipe, isRecipe } from '../models/recipe'
import logger from '../utils/logger'

const fetchRecipeById = async (req: Request, res: Response) => {
  logger.info('GET recipe by id')
  try {
    const recipe = await Recipes.findById(req.params.id)
    res.send(recipe).end()
  } catch (err) {
    logger.error(err)
    res.status(400).send('Something failed').end()
  }
}

const fetchRecipes = async (_: Request, res: Response) => {
  logger.info('GET all recipes')
  try {
    const got = await Recipes.find({ hidden: false })
    res.send(got).end()
  } catch (err) {
    logger.error(err)
    res.status(400).send('Something failed').end()
  }
}

const fetchRecipesByUserId = async (req: Request, res: Response) => {
  logger.info(`GET all recipes for user: ${req.params?.userId}`)
  try {
    const got = await Recipes.find({ userId: req.params?.userId })
    res.send(got).end()
  } catch (err) {
    logger.error(err)
    res.status(400).send('Something failed').end()
  }
}

const uploadRecipe = async (req: Request, res: Response) => {
  logger.info('POST request to upload recipe.')
  try {
    const recipe: Recipe = req.body
    if (!isRecipe(recipe)) {
      throw new Error('Tried to create recipe object with missing properties')
    }
    const result = await Recipes.create(recipe)
    logger.verbose(`Recipe uploaded with: ${result}`)
    res.status(201).send(result).end()
  } catch (err) {
    logger.warn(err)
    res.status(400).send('Invalid request').end()
  }
}

export {
  fetchRecipeById,
  fetchRecipes,
  fetchRecipesByUserId,
  uploadRecipe
}
