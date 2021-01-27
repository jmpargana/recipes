import { Router } from 'express'
import { fetchRecipes, fetchRecipeById, uploadRecipe } from './controllers'

const router = Router()

router.get('/recipe/:id', fetchRecipeById)
router.get('/recipes', fetchRecipes)
router.post('/', uploadRecipe)

export default router
