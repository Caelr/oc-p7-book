import { NextFunction, Request, Response } from 'express'
import { validateUserPassword } from '../service/user.service'
import { config } from '../utils/config'
import { signJwt } from '../utils/jwt.utils'

export const createSessionHandler = async (req: Request, res: Response, next: NextFunction) => {
  const user = await validateUserPassword(req.body)
  if (!user) return res.status(401).send('Invalide email or password')

  const accessToken = signJwt({ ...user }, { expiresIn: config.ACCESS_TOKEN_TIME_TO_LIVE })

  return res.status(200).json({ userId: user._id, token: accessToken })
}
