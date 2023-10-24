import mongoose from 'mongoose'

import { config } from './config'
import log from './logger'

const connect = async () => {
  const db = config.DATABASE_URL
  try {
    await mongoose.connect(db)
    log.info('Connected to DB')
  } catch (error) {
    log.error('Could not connect to DB')
    process.exit(1)
  }
}

export default connect
