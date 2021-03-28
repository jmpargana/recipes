import {Router} from 'express'
import {fetchRecipes, fetchRecipeById, uploadRecipe, fetchRecipesByUserId, register, login} from './controllers'
import checkJwt from '../utils/auth'

const router = Router()

router.get('/recipe/:id', fetchRecipeById)
router.get('/recipes', fetchRecipes)
router.get('/recipes/:userId', checkJwt, fetchRecipesByUserId)
router.post('/', uploadRecipe)
router.post('/user/register', register)
router.post('/user/login', login)

export default router
