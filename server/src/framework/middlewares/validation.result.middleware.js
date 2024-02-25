import { validationResult } from 'express-validator'
import { response } from '../responses/response.js'

export const validationErrorsMiddleware = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return response(res, 400, { error: { message: errors.array()[0].msg } })
  }
  next()
}
