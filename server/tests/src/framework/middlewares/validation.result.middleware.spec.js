import { validationErrorsMiddleware } from '../../../../src/framework/middlewares/validation.result.middleware.js'
import { response } from '../../../../src/framework/responses/response.js'
import { validationResult } from 'express-validator'

jest.mock('../../../../src/framework/responses/response.js', () => ({
  response: jest.fn()
}))

jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}))

describe('validationErrorsMiddleware', () => {
  const mockReq = {}
  const mockRes = {}
  const mockNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls next() when there are no validation errors', () => {
    validationResult.mockReturnValue({
      isEmpty: () => true
    })

    validationErrorsMiddleware(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(response).not.toHaveBeenCalled()
  })

  it('returns a 400 response when there are validation errors', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Invalid input' }]
    })

    validationErrorsMiddleware(mockReq, mockRes, mockNext)

    expect(response).toHaveBeenCalledWith(mockRes, 400, { error: { message: 'Invalid input' } })
    expect(mockNext).not.toHaveBeenCalled()
  })
})
