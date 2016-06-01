require('babel-polyfill')
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
const router = new Router()

import { createAccount } from './api'

app.use(bodyParser())
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
})

app.use(async (ctx, next) => {
  ctx.body = ctx.request.body
  await next()
})

router.post('/account', createAccount)

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3001)
