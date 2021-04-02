import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger'

const secret = process.env.JWT_SECRET ?? 'JWT_SECRET'

const secured = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('Authorization')
  const token = header?.split(' ')[1]

  if (!token) return res.sendStatus(401)

  jwt.verify(token, secret, (err, doc) => {
    if (err) {
      logger.warn(err)
      return res.sendStatus(401)
    }
    // @ts-ignore
    req.user = doc.user
    next()
  })
}

export {
  secured
}
