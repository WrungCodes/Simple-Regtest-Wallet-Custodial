import chargeRepository from '../../../../src/domain/repositories/charge.repository.js'

describe('chargeRepository', () => {
  let mockRepository
  let chargeRepo

  beforeEach(() => {
    mockRepository = {
      findBy: jest.fn(),
      findById: jest.fn(),
      insert: jest.fn()
    }
    chargeRepo = chargeRepository(mockRepository)
  })

  describe('findByUserId', () => {
    it('calls findBy on the repository with "userId" and the provided userId', async () => {
      const userId = 123
      await chargeRepo.findByUserId(userId)
      expect(mockRepository.findBy).toHaveBeenCalledWith('userId', userId)
    })
  })

  describe('findById', () => {
    it('calls findById on the repository with the provided id', async () => {
      const id = 123
      await chargeRepo.findById(id)
      expect(mockRepository.findById).toHaveBeenCalledWith(id)
    })
  })

  describe('add', () => {
    it('calls insert on the repository with the provided charge object', async () => {
      const charge = { amount: 100, userId: 123 }
      await chargeRepo.add(charge)
      expect(mockRepository.insert).toHaveBeenCalledWith(charge)
    })
  })
})
