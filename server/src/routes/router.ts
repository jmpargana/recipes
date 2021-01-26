import { Router } from 'express'
import { recipeById  } from './controllers'

const router = Router()

router.get('/recipe/:id', recipeById)

export default router
