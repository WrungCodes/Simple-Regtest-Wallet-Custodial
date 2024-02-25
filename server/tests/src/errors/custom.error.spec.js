import { handleError, CustomError } from '../../../src/errors/custom.error.js'
import config from '../../../src/configs/index.js'
import { response } from '../../../src/framework/responses/response.js'

jest.mock('../../../src/framework/responses/response.js', () => ({
  response: jest.fn()
}))

jest.mock('../../../src/configs/index.js', () => ({
  IS_PRODUCTION_ENV: false
}))

describe('Error Handling', () => {
  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(() => mockRes)
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('handles custom errors correctly', () => {
    const customError = new CustomError(400, 'Custom error message', 'http://documentation.url')
    handleError(customError, mockRes)

    expect(response).toHaveBeenCalledWith(mockRes, 400, expect.objectContaining({
      error: expect.objectContaining({
        message: 'Custom error message',
        documentationUrl: 'http://documentation.url'
      })
    }))
  })

  it('handles unexpected errors correctly in non-production environment', () => {
    const unexpectedError = new Error('Unexpected error message')
    handleError(unexpectedError, mockRes)

    expect(response).toHaveBeenCalledWith(mockRes, 500, expect.objectContaining({
      error: expect.objectContaining({
        message: 'Unexpected error message'
      })
    }))
  })

  it('handles string errors correctly in non-production environment', () => {
    const errorString = 'String error message'
    handleError(errorString, mockRes)

    expect(response).toHaveBeenCalledWith(mockRes, 500, expect.objectContaining({
      error: expect.objectContaining({
        message: 'String error message'
      })
    }))
  })

  it('handles unexpected errors without leaking details in production environment', () => {
    config.IS_PRODUCTION_ENV = true
    const unexpectedError = new Error('Unexpected error message')
    handleError(unexpectedError, mockRes)

    expect(response).toHaveBeenCalledWith(mockRes, 500, expect.objectContaining({
      error: expect.objectContaining({
        message: 'Internal Server Error'
      })
    }))
    config.IS_PRODUCTION_ENV = false
  })
})
