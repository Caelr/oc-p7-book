import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import Book, { BookInput } from '../models/book.model'

export const findAllBooks = async () => {
  return Book.find()
}

export const findBook = async (query: FilterQuery<BookInput>, options: QueryOptions = { lean: true }) => {
  return Book.findOne(query, {}, options)
}

export const findBestBooks = async () => {
  return Book.find().sort({ averageRating: -1 }).limit(3)
}

export const createBook = (input: BookInput) => {
  return Book.create(input)
}

export const findAndUpdateBook = (
  query: FilterQuery<BookInput>,
  update: UpdateQuery<BookInput>,
  options: QueryOptions
) => {
  return Book.findOneAndUpdate(query, update, options)
}

export const deleteBook = (query: FilterQuery<BookInput>) => {
  return Book.deleteOne(query)
}

export const findAndRateBook = async (
  query: FilterQuery<BookInput>,
  update: UpdateQuery<BookInput>,
  options: QueryOptions
) => {
  return Book.findOneAndUpdate(query, update, options)
}
