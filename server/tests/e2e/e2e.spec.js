import request from 'supertest'
import { app } from '../../src/framework/express.js'

describe('GET /test', () => {
  it('should return welcome response', async () => {
    return request(app)
      .get('/test')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Server running')
      })
  })
})
