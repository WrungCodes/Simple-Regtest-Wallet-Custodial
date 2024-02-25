import passport from 'passport'
import { response } from '../responses/response.js'

export const authMiddleware = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err || !user) {
      return response(res, 401, { error: { message: 'Unauthorized User' } })
    } else {
      res.locals.user = user
      return next()
    }
  })(req, res, next)
}
