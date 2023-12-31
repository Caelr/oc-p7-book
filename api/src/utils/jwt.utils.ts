import jwt from 'jsonwebtoken'
import { config } from './config'

const privateKey = config.PRIVATE_KEY
const publicKey = config.PUBLIC_KEY

export const signJwt = (object: Object, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256'
  })
}
export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message = 'Expired',
      decoded: null
    }
  }
}
