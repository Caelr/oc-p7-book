import { TypeOf, array, number, object, string } from 'zod'

const shared = {
  userId: string({
    required_error: 'Title is required'
  }),
  title: string({
    required_error: 'Title is required'
  }),
  author: string({
    required_error: 'Author is required'
  }),
  year: number({
    required_error: 'Year is required as a number'
  }),
  genre: string({
    required_error: 'Genre is required'
  })
}

const rating = {
  userId: string({
    required_error: 'userId is required'
  }),

  rating: number({
    required_error: 'grade is required'
  })
}

const payload = {
  body: object({
    ...shared,
    ratings: array(
      object({
        userId: string(),
        grade: number({
          required_error: 'Rating is required'
        })
          .int()
          .min(1, 'Rating is minimum 1')
          .max(5, 'Rating is maximum 5')
      })
    ),

    imageUrl: string({
      required_error: 'Image is required'
    }),

    averageRating: number({
      required_error: 'the average rating is required'
    })
  })
}

const updatePayload = {
  body: object({
    ...shared,
    imageUrl: string().optional()
  })
}

const params = {
  params: object({
    id: string({
      required_error: 'Book id is required'
    })
  })
}

export const createBookSchema = object({
  ...payload
})

export const updateBookSchema = object({
  ...updatePayload,
  ...params
})

export const deleteBookSchema = object({
  ...params
})

export const findBookSchema = object({
  ...params
})

export const rateBookSchema = object({
  ...rating
})

export type CreateBookInput = TypeOf<typeof createBookSchema>
export type UpdateBookInput = TypeOf<typeof updateBookSchema>
export type DeleteBookInput = TypeOf<typeof deleteBookSchema>
export type FindBookInput = TypeOf<typeof findBookSchema>
export type RateBookInput = TypeOf<typeof rateBookSchema>
