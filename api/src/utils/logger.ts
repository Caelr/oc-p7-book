import pino from 'pino'

const log = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname'
    }
  }
})

export default log
