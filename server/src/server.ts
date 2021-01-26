import express from 'express'
import logger from './utils/logger'
import router from './routes/router'

const port = process.env.PORT ?? 3000
const app = express()

app.use('/', router)
app.all('*', (_, res) => {
  res.status(404).end()
})

app.listen(port, () => {
  logger.info(`Started server on port: ${port}`)
})
