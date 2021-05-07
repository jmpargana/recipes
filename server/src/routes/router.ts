import { Router } from "express"
import {
  fetchRecipes,
  fetchRecipeById,
  uploadRecipe,
  fetchRecipesByUserId,
  registerUser,
} from "./controllers"
import checkJwt from "../utils/auth"

const router = Router()

router.get("/recipe/:id", fetchRecipeById)
router.get("/recipes", fetchRecipes)
router.get("/recipes/:userId", checkJwt, fetchRecipesByUserId)
router.post("/register", registerUser)
router.post("/", uploadRecipe)

export default router
