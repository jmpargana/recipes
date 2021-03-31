import express from 'express'
import request from 'supertest'
import {connect} from './dbhandler'
import router from '../routes/router'

const app = express()

beforeAll(async () => {
  app.use(express.json())
  app.use('/', router)
  await connect()
})

describe('secured', () => {
  it('reject unsigned in user', async () => {
    const res = await request(app).post('/')
    expect(res.status).toEqual(401)
  })

  it('accept request but fail with invalid object', async () => {
    await request(app).post('/user/register').send({email: 'joe', password: 'fish'})
    const login = await request(app).post('/user/login').send({email: 'joe', password: 'fish'})
    const res = await request(app).post('/').set('Authorization', 'Bearer ' + login.body.token)
    expect(res.status).toEqual(400)
  })

  it('upload recipe to server and find by userId', async () => {
    await request(app).post('/user/register').send({email: 'joe2', password: 'fish'})
    const login = await request(app).post('/user/login').send({email: 'joe2', password: 'fish'})
    const recipe = {
      userId: login.body.user._id,
      title: 'something',
      ingridients: ['this', 'that'],
      method: 'a long description',
      time: 30,
      hidden: true,
      tags: ['yummy', 'italian']
    }
    const res = await request(app).post('/').set('Authorization', 'Bearer ' + login.body.token).send(recipe)
    expect(res.status).toEqual(201)

    const recipes = await request(app).get('/recipes/user').set('Authorization', 'Bearer ' + login.body.token)
    expect(recipes.status).toEqual(200)
    expect(recipes.body.map(({_id, __v, ...res}) => res)).toEqual([
      recipe
    ])
  })
})
