import {Router} from 'express'
import {fetchRecipes, fetchRecipeById, uploadRecipe, fetchRecipesByUserId, register, login} from './controllers'
import {secured} from './middleware'

const router = Router()

router.get('/', fetchRecipes)
router.get('/user', secured, fetchRecipesByUserId)
router.get('/:id', fetchRecipeById)
router.post('/', secured, uploadRecipe)
router.post('/register', register)
router.post('/login', login)

export default router
