import request from 'supertest'
import mongoose from 'mongoose'
import express from 'express'
import {connect} from './dbhandler'
import router from '../routes/router'

const app = express()

beforeAll(async () => {
  app.use(express.json())
  app.use('/', router)
  await connect()
})

describe('user routes', () => {
  it('fails: register empty body', async () => {
    const res = await request(app).post('/user/register')
    expect(res.status).toEqual(400)
    expect(res.body.err).toEqual('Error: Invalid user object')
  })

  const invalidUsers = [
    {},
    {email: '', password: ''},
    {email: 'something'},
    {email: 'something', password: ''},
  ]

  test.each(invalidUsers)('fails: invalid user object', async (input) => {
    const res = await request(app).post('/user/register').send(input)
    expect(res.status).toEqual(400)
    expect(res.body.err).toEqual('Error: Invalid user object')
  })

  it('saves user and returns objectId', async () => {
    const res = await request(app).post('/user/register').send({email: 'user', password: 'password'})
    expect(res.status).toEqual(200)
    expect(mongoose.Types.ObjectId.isValid(res.body.user._id)).toBe(true)
  })

  it('same password should allow registered user to login', async () => {
    await request(app).post('/user/register').send({email: 'john', password: 'smith'})
    const res = await request(app).post('/user/login').send({email: 'john', password: 'smith'})
    expect(res.status).toEqual(200)
    expect(mongoose.Types.ObjectId.isValid(res.body.user._id)).toBe(true)
  })

  test.each(invalidUsers)('fails login: invalid user object', async (input) => {
    const res = await request(app).post('/user/login').send(input)
    expect(res.status).toEqual(400)
    expect(res.body.err).toEqual('Error: Invalid user mail and password')
  })

  it('fail with wrong password', async () => {
    await request(app).post('/user/register').send({email: 'peter', password: 'grande'})
    const res = await request(app).post('/user/login').send({email: 'peter', password: 'smalls'})
    expect(res.status).toEqual(400)
  })
})
