import signUp from '../../../../src/domain/usecases/signup.js'

describe('signUp', () => {
  let mockUserService
  let mockPasswordImpl

  beforeEach(() => {
    mockUserService = {
      doesTheEmailExist: jest.fn(),
      createUser: jest.fn()
    }

    mockPasswordImpl = {
      toHash: jest.fn().mockResolvedValue('hashedPassword')
    }
  })

  test('executes successfully and creates a new user', async () => {
    mockUserService.doesTheEmailExist.mockResolvedValue(false)

    const user = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    }

    mockUserService.createUser.mockResolvedValue({ id: 123, ...user })

    const signUpUseCase = signUp(mockUserService, mockPasswordImpl)
    const newUser = await signUpUseCase.execute(user)

    expect(mockPasswordImpl.toHash).toHaveBeenCalledWith('password123')
    expect(mockUserService.doesTheEmailExist).toHaveBeenCalledWith('test@example.com')
    expect(mockUserService.createUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword'
    })
    expect(newUser).toHaveProperty('id', 123)
  })

  test('throws an error if the email already exists', async () => {
    mockUserService.doesTheEmailExist.mockResolvedValue(true)

    const user = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123'
    }

    const signUpUseCase = signUp(mockUserService, mockPasswordImpl)

    await expect(signUpUseCase.execute(user)).rejects.toThrow('Unable to create User due to duplicate mail')

    expect(mockUserService.doesTheEmailExist).toHaveBeenCalledWith('existing@example.com')
    expect(mockUserService.createUser).not.toHaveBeenCalled()
  })
})
