import nxtCrypto from 'nxt-crypto'
const { parseToken, getAccountRS } = nxtCrypto

export const isAccountRS = async (ctx, next) => {
  const { token } = ctx.query
  const { accountRS } = ctx.params

  try {
    if (!token || token.length !== 160) {
      throw Error()
    }

    const parsedToken = parseToken(token, accountRS)

    if (parsedToken.isValid && getAccountRS(parsedToken.publicKey, accountRS.slice(0, 3)) === accountRS) {
      return await next()
    }

    throw Error()
  } catch (e) {
    ctx.body = {
      status: 'error',
      errorDescription: 'Invalid token'
    }
  }
}
