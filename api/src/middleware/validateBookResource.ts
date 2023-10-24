import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

type BookData = {
  userId: string
  title: string
  author: string
  genre: string
  year: number
  imageUrl: string
}

const validateBook = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.file && req.file.filename) {
      const bookData = {
        ...JSON.parse(req.body.book),
        userId: res.locals.user._id,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
      bookData.year = Number(bookData.year)
      delete bookData._id
      delete bookData._userId

      bookData.title = bookData.title.trim()
      bookData.author = bookData.author.trim()
      bookData.genre = bookData.genre.trim()

      req.body = bookData
    }

    req.body.year = Number(req.body.year)

    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    })

    next()
  } catch (error: any) {
    return res.status(400).send(error.errors)
  }
}

export default validateBook
