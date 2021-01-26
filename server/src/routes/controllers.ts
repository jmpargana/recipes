import { Request, Response } from 'express'

const recipeById = (req: Request, res: Response) => {
  res.send().end()
}

export {
  recipeById
}
