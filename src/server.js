require('babel-polyfill')
import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
})

app.use(async ctx => {
  ctx.body = 'Hello world'
})

app.listen(3000)
