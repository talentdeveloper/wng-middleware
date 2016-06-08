import config from '../config.json'
import { parseToken } from './crypto'

const { adminPublicKeys } = config

export const isAdmin = async (ctx, next) => {
  const { token } = ctx.query

  if (!token || token.length !== 160) {
    throw Error('Token invalid')
  }

  const parsedToken = parseToken(token, 'admin')

  if (parsedToken.isValid && adminPublicKeys.includes(parsedToken.publicKey)) {
    return await next()
  }

  ctx.body = {
    status: 'error',
    errorDescription: 'Invalid token'
  }

  ctx.status = 500
}
