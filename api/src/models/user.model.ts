import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { config } from '../utils/config'

export interface UserInput {
  email: string
  password: string
}

export interface UserDocument extends UserInput, mongoose.Document {
  comparePassword(candidatePassword: string): Promise<Boolean>
}

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true }
})

userSchema.plugin(uniqueValidator)

userSchema.pre('save', async function (next) {
  let user = this as UserDocument
  if (!user.isModified('password')) return next()
  const salt = await bcrypt.genSalt(config.ROUNDS)
  const hash = bcrypt.hashSync(user.password, salt)
  user.password = hash
  return next()
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument
  return bcrypt.compare(candidatePassword, user.password).catch((error) => false)
}

const User = mongoose.model<UserDocument>('User', userSchema)
export default User
