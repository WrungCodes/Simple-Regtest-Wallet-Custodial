import config from '../configs/index.js'
import { response } from '../framework/responses/response.js'

export class CustomError extends Error {
  constructor (httpStatusCode, message, documentationUrl) {
    if (message) {
      super(message)
    } else {
      super('a generic error occurred!')
    }

    this.httpStatusCode = httpStatusCode
    this.timestamp = new Date().toISOString()
    this.documentationUrl = documentationUrl

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (error, res) => {
  if (isCustomError(error)) {
    handleCustomError(error, res)
  } else {
    handleUnexpectedError(error, res)
  }
}

const isCustomError = (error) => {
  return error instanceof CustomError
}

const handleCustomError = (error, res) => {
  let stackTrace

  enableStackTrace(stackTrace, error)

  reportAndReturnError(error.httpStatusCode, error.message, stackTrace, error, res)
}

const handleUnexpectedError = (error, res) => {
  const httpStatusCode = 500
  let message = 'Internal Server Error'

  if (!config.IS_PRODUCTION_ENV) {
    if (typeof error === 'string') {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
  }

  let stackTrace

  enableStackTrace(stackTrace, error)

  reportAndReturnError(httpStatusCode, message, stackTrace, error, res)
}

const enableStackTrace = (stackTrace, error) => {
  if (!config.IS_PRODUCTION_ENV) {
    stackTrace = error.stack
  }
}

const reportAndReturnError = (httpStatusCode, message, stackTrace, error, res) => {
  return response(res, httpStatusCode, {
    error: {
      message,
      timestamp: error.timestamp || undefined,
      documentationUrl: error.documentationUrl || undefined,
      stackTrace
    }
  })
}
