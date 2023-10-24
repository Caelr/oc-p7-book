import { Request } from 'express'
import fs from 'fs'
import multer from 'multer'



const MIME_TYPES: { [key: string]: string } = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const images = 'src/images'

if (!fs.existsSync(images)) {
  fs.mkdirSync(images, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    callback(null, images)
  },
  filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    const name = file.originalname.split(' ').join('_').split('.').slice(0, -1).join('')
    const extension = MIME_TYPES[file.mimetype]
    const filename = `${name}${Date.now()}.${extension}`

    callback(null, filename)
  }
})

const uploadMiddleware = multer({ storage }).single('image')

export default uploadMiddleware
