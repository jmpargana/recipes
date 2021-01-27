import express from 'express'
import request from 'supertest'
import router from '../routes/router'

const app = express()
app.use('/', router)

describe('recipe\'s server api', () => {
  it('sanity test', () => {
  })

  it('GET recipe by id', async () => {
    const result = await request(app).get('/recipe/kljsf')
    expect(result.status).toEqual(200)
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
    const res = await request(app).post('/')
    expect(res.status).toEqual(400)
  })
})
