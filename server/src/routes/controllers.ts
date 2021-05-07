import {Request, Response} from 'express'
import Recipes, {Recipe, isRecipe} from '../models/recipe'
import {isUser, Users} from '../models/user'
import logger from '../utils/logger'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET ?? 'JWT_SECRET'

const fetchRecipeById = async (req: Request, res: Response) => {
  logger.info("GET recipe by id")
  try {
    const recipe = await Recipes.findById(req.params.id)
    res.send(recipe).end()
  } catch (err) {
    logger.error(err)
    res.status(400).send("Something failed").end()
  }
}

const fetchRecipes = async (_: Request, res: Response) => {
  logger.info("GET all recipes")
  try {
    const got = await Recipes.find({hidden: false})
    res.send(got).end()
  } catch (err) {
    logger.error(err)
    res.status(400).send("Something failed").end()
  }
}

const fetchRecipesByUserId = async (req: Request, res: Response) => {
  // @ts-ignore
  logger.info(`GET all recipes for user: ${req.user.email}`)
  try {
    // @ts-ignore
    const got = await Recipes.find({userId: req.user._id})
    res.send(got).end()
  } catch (err) {
    logger.error(err)
    res.status(400).send("Something failed").end()
  }
}

const uploadRecipe = async (req: Request, res: Response) => {
  logger.info("POST request to upload recipe.")
  try {
    const recipe: Recipe = req.body
    if (!isRecipe(recipe)) {
      throw new Error("Tried to create recipe object with missing properties")
    }
    const result = await Recipes.create(recipe)
    logger.verbose(`Recipe uploaded with: ${result}`)
    res.status(201).send(result).end()
  } catch (err) {
    logger.warn(err)
    res.status(400).send("Invalid request").end()
  }
}

const registerUser = async (req: Request, res: Response) => {
  logger.info("POST register new user")
  try {
    const user = req.body
    // FIXME: use isUser function
    if (!user) {
      throw new Error("invalid or missing fields")
    }
    await Users.create(user)
    res.send().end()
  } catch (err) {
    res.status(401).send(err.toString())
  }
}

const loginUser = async (req: Request, res: Response) => {
  logger.info("POST login existing user")
  try {
    const user = req.body
    // FIXME: use isUser function
    if (!user) {
      throw new Error("invalid or missing fields")
    }
    // FIXME: compare given password
    if (compareSync(user.password, user.password)) {
      throw new Error("invalid credentials")
    }
    res.send().end()
  } catch (err) {
    res.status(401).send(err.toString())
  }
}

const register = async (req: Request, res: Response) => {
  logger.info('POST register new user')
  try {
    const user = req.body
    if (!isUser(user)) {
      throw new Error('Invalid user object')
    }
    const hash = await bcrypt.genSalt(12)
    Users.create({
      email: user.email,
      password: await bcrypt.hash(user.password, hash)
    }, (err, doc) => {
      if (err) throw err
      res.json({user: doc}).end()
    })
  } catch (err) {
    logger.warn(err)
    res.status(400).json({err: err.toString()})
  }
}

const login = async (req: Request, res: Response) => {
  logger.info('POST login')
  try {
    const user = req.body
    if (!isUser(user)) {
      throw new Error('Invalid user mail and password')
    }
    const u = await Users.findOne({email: user.email})
    if (!u) {
      throw new Error('User not registered')
    }
    const valid = await bcrypt.compare(user.password, u.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
    const token = jwt.sign({user: u}, secret)
    res.json({user: {email: u.email, _id: u._id}, token}).end()
  } catch (err) {
    logger.warn(err)
    res.status(400).json({err: err.toString()})
  }
}

export {
  fetchRecipeById,
  fetchRecipes,
  fetchRecipesByUserId,
  uploadRecipe,
<<<<<<< HEAD
  registerUser,
  loginUser,
=======
  register,
  login
>>>>>>> 25659404a90c398c3fc0d5a46538962b8389b7b7
}
