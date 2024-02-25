import userRepository from '../../../../src/domain/repositories/user.repository.js'

describe('userRepository', () => {
  let mockRepository
  let repo

  beforeEach(() => {
    mockRepository = {
      findBy: jest.fn(),
      findById: jest.fn(),
      insert: jest.fn()
    }

    repo = userRepository(mockRepository)
  })

  test('findByEmail calls repository.findBy with "email" and the given email', async () => {
    const email = 'test@example.com'
    await repo.findByEmail(email)
    expect(mockRepository.findBy).toHaveBeenCalledWith('email', email)
  })

  test('findById calls repository.findById with the given id', async () => {
    const id = 123
    await repo.findById(id)
    expect(mockRepository.findById).toHaveBeenCalledWith(id)
  })

  test('add calls repository.insert with the given user object', async () => {
    const user = { id: 123, email: 'test@example.com', name: 'Test User' }
    await repo.add(user)
    expect(mockRepository.insert).toHaveBeenCalledWith(user)
  })
})
