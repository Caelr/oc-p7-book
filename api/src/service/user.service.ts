import { omit } from "lodash"
import User, { UserInput } from "../models/user.model"

export const createUser = async (input: UserInput) => {
  try {
    const user = await User.create(input)
    return omit(user.toJSON(), "password")
  } catch (error: any) {
    throw new Error(error)
  }
}

export const validateUserPassword = async ({ email, password }: { email: string; password: string }) => {
  const user = await User.findOne({ email })

  if (!user) return false

  const isValid = await user.comparePassword(password)

  if (!isValid) return false

  return omit(user.toJSON(), "password")
}
