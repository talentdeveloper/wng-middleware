import { Account, AccountVerificationApplication } from './database'

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
  let { limit, offset, search } = ctx.query
  if (!limit || limit <= 0) limit = 10
  if (!offset || offset < 0) offset = 0

  limit = Number(limit)
  offset = Number(offset)

  const query = {
    limit,
    offset,
    order: 'createdAt DESC'
  }

  if (search) {
    query.where = {
      username: {
        $like: `${search}%`
      }
    }
    query.where = {
      $or: [{
        username: {
          $like: `${search}%`
        }
      }, {
        email: {
          $like: `${search}%`
        }
      }, {
        accountRS: {
          $like: `${search}%`
        }
      }
    ]
    }
  }

  await Account.findAndCountAll(query).then(async (result) => {
    ctx.body = {
      status: 'success',
      accounts: result.rows,
      recordsTotal: result.count
    }
  })
}

export const getConstants = async (ctx) => {
  ctx.body = {
    walletVersion: '0.8.0'
  }
}

export const createVerification = async (ctx) => {
  await AccountVerificationApplication.create({
    ...ctx.body
  }).then(async (result) => {
    ctx.body = result
  })
}

export const hasVerification = async (ctx) => {
  const {
    accountRS
  } = ctx.params

  await AccountVerificationApplication.findOne({
    where: {
      accountRS
    }
  }).then(async (result) => {
    if (!result) {
      ctx.body = {
        status: 'error',
        errorDescription: 'No verification application found'
      }
    } else {
      ctx.body = {
        status: 'success',
        account: result
      }
    }
  })
}

export const getVerifications = async (ctx) => {
  let { limit, offset, search } = ctx.query
  if (!limit || limit <= 0) limit = 10
  if (!offset || offset < 0) offset = 0

  limit = Number(limit)
  offset = Number(offset)

  const query = {
    limit,
    offset,
    order: 'createdAt DESC'
  }

  if (search) {
    query.where = {
      accountRS: {
        $like: `${search}%`
      }
    }
  }

  await AccountVerificationApplication.findAndCountAll(query).then(async (result) => {
    ctx.body = {
      status: 'success',
      applications: result.rows,
      recordsTotal: result.count
    }
  })
}

export const updateAccountStatus = async (ctx) => {
  const { id } = ctx.params
  const {
    status
  } = ctx.body
  await AccountVerificationApplication.update(
    { status: status },
    { where: { id } }
  ).then(async (result) => {
    ctx.body = {
      'status': 'success',
      result
    }
  })
}
