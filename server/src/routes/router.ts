import {Router} from 'express'
import {fetchRecipes, fetchRecipeById, uploadRecipe, fetchRecipesByUserId, register, login} from './controllers'
import {secured} from './middleware'

const router = Router()

router.get('/recipe/:id', fetchRecipeById)
router.get('/recipes', fetchRecipes)
router.get('/recipes/user', secured, fetchRecipesByUserId)
router.post('/', secured, uploadRecipe)
router.post('/user/register', register)
router.post('/user/login', login)

export default router
