import { NextFunction, Request, Response } from 'express'

import { CreateUserInput } from '../schema/user.schema'
import { createUser } from '../service/user.service'
import log from '../utils/logger'

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body)
    return res.status(201).json({ message: 'User created successfully' })
  } catch (error: any) {
    log.error(error)
    return res.status(409).send(error.message)
  }
}
