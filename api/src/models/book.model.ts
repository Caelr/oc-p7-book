import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface Rating {
  userId: UserDocument['_id']
  grade: number
}

export interface BookInput {
  title: string
  userId: UserDocument['_id']
  author: string
  imageUrl: string
  year: number
  genre: string
  ratings: Rating[]
  averageRating: number
}

export interface BookDocument extends BookInput, mongoose.Document {}

const bookSchema = new mongoose.Schema({
  title: { type: String, require: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  author: { type: String, require: true },
  imageUrl: { type: String, require: true },
  year: { type: Number, require: true },
  genre: { type: String, require: true },
  ratings: [
    {
      userId: { type: String, require: true },
      grade: { type: Number, require: true }
    }
  ],
  averageRating: { type: Number, require: true }
})

const Book = mongoose.model<BookDocument>('Book', bookSchema)
export default Book
