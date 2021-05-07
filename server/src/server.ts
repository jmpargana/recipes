import express from 'express'
import logger from './utils/logger'
import router from './routes/router'
import mongoose from 'mongoose'
import cors from 'cors'

const port = process.env.PORT ?? 3000
const mongoUri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/test'
const app = express()

logger.info('Connecting to mongodb')
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => logger.info('Connected'))
  .catch(err => logger.error('Could not connect to mongo with:', err))

app.use(express.json())
app.use(cors())
app.use('/api', router)
app.all('*', (_, res) => {
  res.status(404).end()
})

app.listen(port, () => {
  logger.info(`Started server on port: ${port}`)
})
