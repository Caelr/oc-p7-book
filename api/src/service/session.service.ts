import { FilterQuery } from 'mongoose'
import Session, { SessionDocument } from '../models/session.model'

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent })

  return session.toJSON()
}

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return Session.find(query).lean()
}
