import { createLogger, format, transports } from 'winston'

const { timestamp, printf, combine, label } = format

// @ts-ignore
const prettyFormat = printf(({ level, message, label, timestamp }) =>
  `${timestamp} [${label}] ${level}: ${message}`)

const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'silly',
  format: combine(
    label({ label: 'server' }),
    timestamp(),
    prettyFormat
  ),
  transports: [
    new transports.File({ filename: 'combined.log' }),
    new transports.Console()
  ]
})

export default logger
