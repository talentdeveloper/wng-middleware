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
  createVerification,
  updateAccountStatus,
  hasVerification,
  getVerifications
} from './api'
import { isAdmin, isAdminPost } from './admin'
import { isAccountRS } from './user'

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

// verification routes
router.post('/verification', createVerification)
router.post('/admin/verification/:id/status', isAdminPost, updateAccountStatus)
router.get('/verification/:accountRS', isAccountRS, hasVerification)
router.get('/admin/verifications', isAdmin, getVerifications)

const port = process.env.PORT || 3001
app.listen(port)
