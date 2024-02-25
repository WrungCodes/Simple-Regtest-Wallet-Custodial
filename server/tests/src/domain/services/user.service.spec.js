import userService from '../../../../src/domain/services/user.service.js'

describe('userService', () => {
  let mockUserRepository
  let service

  const user = { email: 'test@example.com', name: 'Test User' }

  beforeEach(() => {
    mockUserRepository = {
      add: jest.fn(),
      findByEmail: jest.fn()
    }

    service = userService(mockUserRepository)
  })

  test('createUser calls userRepository.add with the given user object', async () => {
    await service.createUser(user)
    expect(mockUserRepository.add).toHaveBeenCalledWith(user)
  })

  test('createUser throws an error if userRepository.add fails', async () => {
    mockUserRepository.add.mockRejectedValue(new Error('Fail'))
    await expect(service.createUser(user)).rejects.toThrow('Unable to insert User into database')
  })

  test('doesTheEmailExist returns true if the email exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(user)
    const emailExists = await service.doesTheEmailExist('test@example.com')
    expect(emailExists).toBeTruthy()
  })

  test('doesTheEmailExist returns false if the email does not exist', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null)
    const emailExists = await service.doesTheEmailExist('notfound@example.com')
    expect(emailExists).toBeFalsy()
  })

  test('retriveUserByEmail throws an error if no user is found with the given email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null)
    await expect(service.retriveUserByEmail('notfound@example.com')).rejects.toThrow('User not found using email')
  })

  test('retriveUserByEmail does not throw an error when the user is found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(user)
    await expect(service.retriveUserByEmail('test@example.com')).resolves.not.toThrow()
  })
})
