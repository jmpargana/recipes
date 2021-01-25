import request from 'supertest'
import router from '../router'

describe('recipe\'s server api', () => {
  it('sanity test', () => {
  })

  it('GET recipe by id', async () => {
    const result = await request(router).get('/recipe')
    expect(result.status).toEqual(200)
  })
})
