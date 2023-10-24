import { Express, NextFunction, Request, Response } from 'express'

import { createSessionHandler } from './controller/session.controller'
import { createUserHandler } from './controller/user.controller'

import validate from './middleware/validateResources'

import {
  createBookHandler,
  deleteBookHandler,
  findAllBooksHandler,
  findAndRateBookHandler,
  findAndUpdateBookHandler,
  findBestBooksHandler,
  findBookHandler
} from './controller/book.controller'
import uploadMiddleware from './middleware/multer'
import { requireUser } from './middleware/requireUser'
import validateBook from './middleware/validateBookResource'
import { createBookSchema, deleteBookSchema, rateBookSchema, updateBookSchema } from './schema/book.schema'
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'
import validateReview from './middleware/validateReview'
import sharpMiddleware from './middleware/sharp'

const routes = (app: Express) => {
  app.get('/health', (req: Request, res: Response, next: NextFunction) => res.sendStatus(200))

  // Auth
  app.post('/api/auth/signup', validate(createUserSchema), createUserHandler)
  app.post('/api/auth/login', validate(createSessionSchema), createSessionHandler)

  // Books
  app.get('/api/books', findAllBooksHandler)
  app.get('/api/books/bestrating', findBestBooksHandler)
  app.get('/api/books/:id', findBookHandler)
  app.post('/api/books/:id/rating', [requireUser, validateReview(rateBookSchema)], findAndRateBookHandler)
  app.post('/api/books', [requireUser, uploadMiddleware, sharpMiddleware, validateBook(createBookSchema)], createBookHandler)
  app.put('/api/books/:id', [requireUser, uploadMiddleware, sharpMiddleware,validateBook(updateBookSchema)], findAndUpdateBookHandler)
  app.delete('/api/books/:id', [requireUser, validate(deleteBookSchema)], deleteBookHandler)
}

export default routes
