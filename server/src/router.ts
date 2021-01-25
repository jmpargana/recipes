import { Router, Request, Response } from 'express'

const router = Router()

router.get('/recipe', (_: Request, res: Response) => {
  res.send().end()
})

export default router
