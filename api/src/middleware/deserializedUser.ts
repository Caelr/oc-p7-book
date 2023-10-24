import { NextFunction, Request, Response } from 'express'
import { verifyJwt } from '../utils/jwt.utils'

export const deserializedUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (!accessToken) return next()

  const { decoded, expired } = verifyJwt(accessToken)

  if (decoded) {
    res.locals.user = decoded
    return next()
  }

  return next()
}
