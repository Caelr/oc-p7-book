import { Static, Type } from '@sinclair/typebox'
import envSchema from 'env-schema'

const schema = Type.Object({
  PORT: Type.Number({
    default: 4000
  }),
  ROUNDS: Type.Number({
    default: 10
  }),
  DATABASE_URL: Type.String(),
  PUBLIC_KEY: Type.String(),
  PRIVATE_KEY: Type.String(),
  ACCESS_TOKEN_TIME_TO_LIVE: Type.String({
    default: '24h'
  }),
})

type Env = Static<typeof schema>

export const config = envSchema<Env>({
  schema,
  dotenv: true
})

