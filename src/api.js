import { Account } from './database'

export const register = async (ctx) => {
  await Account.create({
    ...ctx.body
  }).then(async (result) => {
    ctx.body = result
  })
}

export const getAccount = async (ctx) => {
  const {
    username,
    email
  } = ctx.query

  await Account.findOne({
    where: {
      username,
      email
    }
  }).then(async (result) => {
    if (!result) {
      ctx.body = {
        status: 'error',
        errorDescription: 'User not found'
      }
    } else {
      ctx.body = {
        status: 'success',
        account: result
      }
    }
  })
}

export const getAccounts = async (ctx) => {
  let { limit, offset } = ctx.query
  if (!limit || limit <= 0) limit = 10
  if (!offset || offset < 0) offset = 0

  limit = Number(limit)
  offset = Number(offset)

  await Account.findAndCountAll({
    limit,
    offset,
    order: 'createdAt DESC'
  }).then(async (result) => {
    ctx.body = {
      status: 'success',
      accounts: result.rows,
      recordsTotal: result.count
    }
  })
}
