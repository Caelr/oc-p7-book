import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import { CreateBookInput, DeleteBookInput, FindBookInput, RateBookInput, UpdateBookInput } from '../schema/book.schema'
import {
  createBook,
  deleteBook,
  findAllBooks,
  findAndRateBook,
  findAndUpdateBook,
  findBestBooks,
  findBook
} from '../service/book.service'

export const createBookHandler = async (
  req: Request<{}, {}, CreateBookInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await createBook(req.body)
    res.status(201).json({ message: 'Book created' })
  } catch (error: any) {
    res.status(500).json({ error })
  }
}

export const deleteBookHandler = async (req: Request<DeleteBookInput['params']>, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user._id
    const bookId = req.params.id
    const book = await findBook({ _id: bookId })

    if (!book) {
      res.status(404).json({ error: 'Book not found' })
    } else if (String(book.userId) !== userId) {
      res.status(403).json({ error: 'Unauthorized' })
    } else {
      const filename = book?.imageUrl.split('/images/')[1]
      fs.unlink(`src/images/${filename}`, async () => {
        await deleteBook({ _id: bookId })
        res.status(200).json({ message: 'Deleted successfully' })
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const findAllBooksHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await findAllBooks()
    res.status(200).json(books)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
}

export const findBookHandler = async (req: Request<FindBookInput['params']>, res: Response, next: NextFunction) => {
  try {
    const book = await findBook({ _id: req.params.id })
    return res.status(200).json(book)
  } catch (error: any) {
    res.sendStatus(404)
  }
}

export const findBestBooksHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bestBooks = await findBestBooks()
    return res.status(200).json(bestBooks)
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const findAndUpdateBookHandler = async (
  req: Request<UpdateBookInput['params']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user._id
    const bookId = req.params.id
    const update = req.body

    const book = await findBook({ _id: bookId })

    if (!book) {
      res.status(404).json({ error: 'Book not found' })
    } else if (String(book.userId) !== userId) {
      res.status(403).json({ error: 'Unauthorized' })
    } else {
      const filename = book?.imageUrl.split('/images/')[1]
      const filePath = `src/images/${filename}`
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            throw err
          }
        })
      }
      const updatedBook = await findAndUpdateBook({ _id: bookId }, update, { new: true })
      res.status(200).json(updatedBook)
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const findAndRateBookHandler = async (
  req: Request<FindBookInput['params'], {}, RateBookInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user._id
    const bookId = req.params.id
    const body = req.body

    const book = await findBook({ _id: bookId })

    if (!book) return res.status(404).json({ error: 'Book not found' })

    if (body.userId !== userId) return res.status(403).json({ error: 'Unauthorized' })

    const existingRate = book.ratings.findIndex((rating) => String(rating.userId) === userId)
    if (existingRate !== -1) {
      book.ratings[existingRate].grade = body.rating
    } else {
      book.ratings.push({ userId: body.userId, grade: body.rating })
    }
    const totalRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0)
    book.averageRating = Number((totalRating / book.ratings.length).toFixed(1))

    const updatedBook = await findAndRateBook(
      { _id: bookId },
      { ratings: book.ratings, averageRating: book.averageRating },
      { new: true }
    )

    return res.status(200).json(updatedBook)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
