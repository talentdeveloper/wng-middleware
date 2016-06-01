import { Account } from './database'

export const register = async (ctx) => {
  await Account.create({
    ...ctx.body
  }).then(async (result) => {
    ctx.body = result
  })
  .catch(async (err) => {
    ctx.body = {
      status: 'error',
      description: err.message
    }
  })
}

export const getAccount = async (ctx) => {
  console.log(ctx.query)
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
    console.log(result)
    if (!result) {
      ctx.body = {
        status: 'error',
        description: 'User not found'
      }
    } else {
      ctx.body = {
        status: 'success',
        user: result
      }
    }
  })
  .catch(async (err) => {
    console.log(err)
    ctx.body = err.errors
  })
}
