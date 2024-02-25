import jwtCookieImplementation, { JWT_TAG } from '../../../src/external/jwt.js'
import jwt from 'jsonwebtoken'
import config from '../../../src/configs/index.js'

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}))

describe('jwtCookieImplementation', () => {
  const { addCookieBodyParameter, getCookieTag } = jwtCookieImplementation()
  const authenticatedUser = { id: '123', name: 'Test User', email: 'test@example.com' }

  beforeEach(() => {
    jwt.sign.mockClear()
    jwt.sign.mockImplementation((payload, secret) => 'mocked_jwt_token')
  })

  it('generates a token and returns cookie configuration', () => {
    const result = addCookieBodyParameter(authenticatedUser)
    expect(result[0]).toBe(JWT_TAG)
    expect(result[1]).toBe('mocked_jwt_token')
    expect(result[2]).toEqual({
      httpOnly: true,
      secure: config.IS_PRODUCTION_ENV
    })
    expect(jwt.sign).toHaveBeenCalled()
  })

  it('returns the correct JWT tag for the cookie', () => {
    expect(getCookieTag()).toBe(JWT_TAG)
  })
})
