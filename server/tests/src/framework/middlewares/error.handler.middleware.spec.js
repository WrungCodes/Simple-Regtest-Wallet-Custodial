import { errorHandlerMiddleware } from '../../../../src/framework/middlewares/error.handler.middleware.js'
import { handleError } from '../../../../src/errors/custom.error.js'

jest.mock('../../../../src/errors/custom.error.js', () => ({
  handleError: jest.fn()
}))

describe('errorHandlerMiddleware', () => {
  const mockErr = new Error('Test error')
  const mockReq = {}
  const mockRes = {}
  const mockNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('processes the error and calls next with the error', () => {
    errorHandlerMiddleware(mockErr, mockReq, mockRes, mockNext)

    expect(handleError).toHaveBeenCalledWith(mockErr, mockRes)

    expect(mockNext).toHaveBeenCalledWith(mockErr)
  })
})
