import express from 'express'
import logger from './utils/logger'
import router from './routes/router'
import mongoose from 'mongoose'

const port = process.env.PORT ?? 3000
const app = express()

logger.info('Connecting to mongodb')
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(express.json())
app.use('/', router)
app.all('*', (_, res) => {
  res.status(404).end()
})

app.listen(port, () => {
  logger.info(`Started server on port: ${port}`)
})
