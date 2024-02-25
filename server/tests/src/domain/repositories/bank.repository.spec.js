import bankRepository from '../../../../src/domain/repositories/bank.repository.js'

describe('bankRepository', () => {
  let mockRepository
  let bankRepo

  beforeEach(() => {
    mockRepository = {
      findManyBy: jest.fn(),
      findById: jest.fn(),
      insert: jest.fn()
    }
    bankRepo = bankRepository(mockRepository)
  })

  describe('findByUserId', () => {
    it('calls findManyBy on the repository with "userId" and the provided userId', async () => {
      const userId = 1
      await bankRepo.findByUserId(userId)
      expect(mockRepository.findManyBy).toHaveBeenCalledWith('userId', userId)
    })
  })

  describe('findById', () => {
    it('calls findById on the repository with the provided id', async () => {
      const id = 1
      await bankRepo.findById(id)
      expect(mockRepository.findById).toHaveBeenCalledWith(id)
    })
  })

  describe('add', () => {
    it('calls insert on the repository with the provided bank object', async () => {
      const bank = { name: 'Test Bank', userId: 'testUserId' }
      await bankRepo.add(bank)
      expect(mockRepository.insert).toHaveBeenCalledWith(bank)
    })
  })
})
