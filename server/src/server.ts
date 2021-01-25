import express from 'express'
import logger from './logger'
import router from './router'

const port = process.env.PORT ?? 3000
const app = express()

app.use('/', router)
app.all('*', (_, res) => {
  res.status(404).end()
})

app.listen(port, () => {
  logger.info(`Started server on port: ${port}`)
})
