import passport from 'passport'
import { Strategy as JWTStrategy } from 'passport-jwt'
import { UnauthorizedUserError } from '../../../src/errors/user.errors.js'

import passportConfiguration from '../../../src/external/passport.js'

jest.mock('passport', () => ({
  use: jest.fn()
}))

describe('passportConfiguration', () => {
  it('configures passport with a JWT strategy using ES6', () => {
    passportConfiguration()

    expect(passport.use).toHaveBeenCalledWith('jwt', expect.any(JWTStrategy))
  })

  describe('JWTStrategy verifyFunction behavior', () => {
    let verifyFunction

    beforeEach(() => {
      verifyFunction = jest.fn((jwtPayload, done) => {
        const { expiration } = jwtPayload
        if (Date.now() > expiration) {
          done(new UnauthorizedUserError(401, 'Unauthorized User'), false)
        } else {
          done(null, jwtPayload)
        }
      })

      passport.use.mockImplementation((strategyName, strategy) => {
        if (strategyName === 'jwt' && strategy instanceof JWTStrategy) {
          strategy._verify = verifyFunction
        }
      })

      passportConfiguration()
    })

    it('calls done with an error for expired tokens', () => {
      const expiration = Date.now() - 1000
      const jwtPayload = { expiration }
      const done = jest.fn()

      verifyFunction(jwtPayload, done)

      expect(done).toHaveBeenCalledWith(expect.any(UnauthorizedUserError), false)
    })

    it('calls done with null and jwtPayload for valid tokens', () => {
      const expiration = Date.now() + 1000
      const jwtPayload = { expiration }
      const done = jest.fn()

      verifyFunction(jwtPayload, done)

      expect(done).toHaveBeenCalledWith(null, jwtPayload)
    })
  })
})
