import express from 'express'
import request from 'supertest'
import router from '../routes/router'
import { connect, closeDatabase, clearDatabase } from './dbhandler'

const app = express()

beforeAll(async () => {
  app.use(express.json())
  app.use('/', router)
  await connect()
})

afterEach(async () => await clearDatabase())

afterAll(async () => await closeDatabase())

describe('recipe\'s server api', () => {
  it('sanity test', () => {
  })

  it('GET recipe by id', async () => {
    const recipe = {
      title: 'hello',
      method: 'hello',
      time: 30,
      ingridients: ['hello'],
      tags: ['hello'],
      userId: 232312324323
    }

    const res = await request(app).post('/').type('json').send(recipe)
    const result = await request(app).get(`/recipe/${res.body._id}`)
    expect(result.status).toEqual(200)
    const { _id, __v, userId, ...got } = result.body
    expect({ ...got, userId }).toEqual({ ...recipe, userId })
  })

  it('GET to other endpoints sould return 404', async () => {
    const res = await request(app).get('/something')
    expect(res.status).toEqual(404)
  })

  it('GET recipes returns array', async () => {
    const res = await request(app).get('/recipes')
    expect(res.body).toEqual([])
  })

  it('POST recipe should fail if body is missing', async () => {
    const invalids = [
      {},
      {
        title: 'hello',
        method: 'there',
        time: 30,
        ingridients: ['and'],
        tags: ['there'],
        userId: 0
      },
      {
        title: 'hello',
        method: 'there',
        time: 0,
        ingridients: ['and'],
        tags: ['there'],
        userId: 232312324323
      },
      {
        title: 'hello',
        method: '',
        time: 30,
        ingridients: [],
        tags: ['there'],
        userId: 232312324323
      },
      {
        title: 'hello',
        method: 'there',
        time: 30,
        ingridients: ['and'],
        tags: [],
        userId: 232312324323
      },
      {
        title: '',
        method: 'there',
        time: 30,
        ingridients: ['and'],
        tags: ['there'],
        userId: 232312324323
      }
    ]
    for (const invalid of invalids) {
      const res = await request(app)
        .post('/')
        .type('json')
        .send(JSON.parse(JSON.stringify(invalid)))
      expect(res.status).toEqual(400)
      expect(res.text).toEqual('Invalid request')
    }
  })

  it('POST should work with complete body', async () => {
    const body = {
      title: 'hello',
      method: 'hello',
      time: 30,
      ingridients: ['hello'],
      tags: ['hello'],
      userId: 232312324323
    }

    const res = await request(app).post('/').type('json').send(body)
    expect(res.status).toEqual(201)
    const { _id, __v, ...got } = res.body
    expect({ ...got, userId: body.userId }).toEqual(body)
  })
})
