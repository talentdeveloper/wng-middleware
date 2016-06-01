require('babel-polyfill')
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
const router = new Router()

import { register, getAccount } from './api'

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
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use((ctx, next) => {
  ctx.body = {
    status: 'error',
    description: 'Route not found'
  }
})

router.post('/register', register)
router.get('/account', getAccount)

app.listen(3001)
