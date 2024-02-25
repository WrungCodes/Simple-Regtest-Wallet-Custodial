import signIn from '../../../../src/domain/usecases/signin.js'

describe('signIn', () => {
  let mockUserService
  let mockPasswordImpl

  beforeEach(() => {
    mockUserService = {
      doesTheEmailExist: jest.fn().mockResolvedValue(true),
      retriveUserByEmail: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User'
      })
    }

    mockPasswordImpl = {
      compare: jest.fn()
    }
  })

  it('successfully signs in a user with valid credentials', async () => {
    mockPasswordImpl.compare.mockResolvedValue(true)

    const signInUseCase = signIn(mockUserService, mockPasswordImpl)
    const user = await signInUseCase.execute({ email: 'test@example.com', password: 'correctPassword' })

    expect(mockUserService.doesTheEmailExist).toHaveBeenCalledWith('test@example.com')
    expect(mockUserService.retriveUserByEmail).toHaveBeenCalledWith('test@example.com')
    expect(mockPasswordImpl.compare).toHaveBeenCalledWith('hashedPassword', 'correctPassword')
    expect(user).toEqual({ name: 'Test User', email: 'test@example.com' })
  })

  it('throws an error if the email does not exist', async () => {
    mockUserService.doesTheEmailExist.mockResolvedValue(false)

    const signInUseCase = signIn(mockUserService, mockPasswordImpl)

    await expect(signInUseCase.execute({ email: 'nonexistent@example.com', password: 'anyPassword' }))
      .rejects.toThrow('Unable to login User due to invalid credentials')
  })

  it('throws an error if the password is incorrect', async () => {
    mockPasswordImpl.compare.mockResolvedValue(false)

    const signInUseCase = signIn(mockUserService, mockPasswordImpl)

    await expect(signInUseCase.execute({ email: 'test@example.com', password: 'wrongPassword' }))
      .rejects.toThrow('Unable to login User due to invalid credentials')
  })
})
