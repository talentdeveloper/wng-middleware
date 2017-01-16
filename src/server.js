require('babel-polyfill')
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'

const app = new Koa()
const router = new Router()

import {
  register,
  getAccount,
  getAccounts,
  getConstants,
  verifyAccount,
  getAccountVerificationApplication,
  getAccountVerificationApplications
} from './api'
import { isAdmin } from './admin'

app.use(cors())
app.use(bodyParser())
app.use(async (ctx, next) => {
  ctx.body = ctx.request.body
  await next()
})
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log('err', err)
    ctx.body = {
      status: 'error',
      errorDescription: err.message
    }
    ctx.status = err.status || 500
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use((ctx, next) => {
  ctx.body = {
    status: 'error',
    errorDescription: 'Route not found'
  }
})

router.post('/register', register)
router.get('/account', getAccount)
router.get('/is-admin', isAdmin, (ctx) => {
  ctx.body = {
    status: 'success',
    isAdmin: true
  }
})
router.get('/accounts', isAdmin, getAccounts)
router.get('/constants', getConstants)
router.post('/verify-account', verifyAccount)
router.get('/account-verification-application', getAccountVerificationApplication)
router.get('/account-verification-applications', getAccountVerificationApplications)

const port = process.env.PORT || 3001
app.listen(port)
