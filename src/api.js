import { Account, AccountVerificationApplication } from './database'
import asyncBusboy from 'async-busboy'
import config from '../config.json'
const { awsID, awsSecret, awsBucket } = config
import AWS from 'aws-sdk'

const S3Client = new AWS.S3({
  accessKeyId: awsID,
  secretAccessKey: awsSecret,
  maxRetries: 3
})

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
  const { files, fields } = await asyncBusboy(ctx.req)
  let accountRS
  let filePath
  const filesArray = []
  if (fields.accountRS) {
    accountRS = fields.accountRS
  }
  files.map((file) => {
    const name = file.fieldname
    filePath = `${accountRS}/${name}`
    const params = {
      Bucket: awsBucket,
      Key: filePath,
      Body: file
    }
    filesArray.push(name)
    S3Client.upload(params, {}, function (err, data) {
      console.log(err, data)
    })
  })
  fields.files = filesArray.join()
  await AccountVerificationApplication.create(fields, {}).then(async (result) => {
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
    },
    order: [
      ['createdAt', 'DESC']
    ]
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
    const url = `https://${awsBucket}.s3.amazonaws.com/`
    ctx.body = {
      status: 'success',
      applications: result.rows,
      recordsTotal: result.count,
      publicURL: url
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
