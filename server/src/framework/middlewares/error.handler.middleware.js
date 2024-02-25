import { handleError } from '../../errors/custom.error.js'

export const errorHandlerMiddleware = (err, req, res, next) => {
  handleError(err, res)
  return next(err)
}
