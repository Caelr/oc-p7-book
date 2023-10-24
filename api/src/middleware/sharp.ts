import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import sharp from 'sharp'

const sharpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next()
    }
    const images = 'src/images'
    const format = 'webp'
    const files = await fs.promises.readdir(images)

    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
        const fileInput = `${images}/${file}`
        const name = file.substring(0, file.lastIndexOf('.'))
        const fileOutput = `${images}/${name}.${format}`

        if (req.file.filename) {
          req.file.filename = `${name}.${format}`
        }

        if (!fs.existsSync(fileOutput)) {
          await sharp(fileInput).toFormat(format, { quality: 80 }).toFile(fileOutput)
          fs.unlinkSync(fileInput)
          next()
        }
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error processing the images' })
  }
}

export default sharpMiddleware
