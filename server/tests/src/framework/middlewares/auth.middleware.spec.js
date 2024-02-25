import passport from 'passport'
import { authMiddleware } from '../../../../src/framework/middlewares/auth.middleware.js'
import { response } from '../../../../src/framework/responses/response.js'

jest.mock('../../../../src/framework/responses/response.js', () => ({
  response: jest.fn()
}))

describe('authMiddleware', () => {
  const mockAuthenticate = jest.spyOn(passport, 'authenticate').mockImplementation((strategy, options, callback) => {
    return (req, res, next) => callback(null, true, null)
  })

  const mockReq = {}
  let mockRes = {}
  const mockNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockRes = { locals: {} }
  })

  it('calls next() for authenticated user', () => {
    authMiddleware(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(response).not.toHaveBeenCalled()
    expect(mockRes.locals.user).toBeTruthy()
  })

  it('calls next() for authenticated user', () => {
    authMiddleware(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(response).not.toHaveBeenCalled()
  })

  it('returns a 401 response for authentication error', () => {
    mockAuthenticate.mockImplementationOnce((strategy, options, callback) => {
      return (req, res, next) => callback(new Error('Authentication Error'), false, null)
    })

    authMiddleware(mockReq, mockRes, mockNext)

    expect(response).toHaveBeenCalledWith(mockRes, 401, { error: { message: 'Unauthorized User' } })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('returns a 401 response when user is not found', () => {
    mockAuthenticate.mockImplementationOnce((strategy, options, callback) => {
      return (req, res, next) => callback(null, false, { message: 'No user found' })
    })

    authMiddleware(mockReq, mockRes, mockNext)

    expect(response).toHaveBeenCalledWith(mockRes, 401, { error: { message: 'Unauthorized User' } })
    expect(mockNext).not.toHaveBeenCalled()
  })
})
