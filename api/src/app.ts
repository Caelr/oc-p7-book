import express from 'express'

import { deserializedUser } from './middleware/deserializedUser'
import routes from './routes'
import { config } from './utils/config'
import connect from './utils/connect'
import log from './utils/logger'
import path from 'path'
import { requestLimit } from './middleware/rateLimit'

const app = express()

const port = config.PORT

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})


app.use(express.json())

app.use('/images', express.static(path.join(__dirname, '/images')))

app.use(deserializedUser)
app.use(requestLimit)

app.listen(port, async () => {
  log.info(`App is running at http://localhost:${port}`)
  await connect()
  routes(app)
})
