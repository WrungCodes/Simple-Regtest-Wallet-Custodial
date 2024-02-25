import passport from 'passport'
import passportJWT from 'passport-jwt'
import { UnauthorizedUserError } from '../errors/user.errors.js'

const JWTStrategy = passportJWT.Strategy
const secret = process.env.JWT_SECRET

export default function passportConfiguration () {
  const cookieExtractor = req => {
    let jwt = null
    if (req && req.cookies) {
      jwt = req.cookies.jwt
    }
    return jwt
  }

  const verifyFunction = (jwtPayload, done) => {
    const { expiration } = jwtPayload
    if (Date.now() > expiration) {
      done(new UnauthorizedUserError(401, 'Unauthorized User'), false)
    }
    done(null, jwtPayload)
  }

  const jwtOption = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: secret
  }

  const jwtStrategy = new JWTStrategy(jwtOption, verifyFunction)
  passport.use('jwt', jwtStrategy)
}
