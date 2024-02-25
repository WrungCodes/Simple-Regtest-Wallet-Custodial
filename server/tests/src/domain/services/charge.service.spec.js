import chargeService from '../../../../src/domain/services/charge.service.js'
import { EntityInsertionIntoDatabaseFailed } from '../../../../src/errors/database.errors.js'

describe('chargeService', () => {
  let mockChargeRepository

  beforeEach(() => {
    mockChargeRepository = {
      add: jest.fn(),
      findByUserId: jest.fn()
    }
  })

  describe('createCharge', () => {
    const sampleCharge = { id: 1, amount: 100, userId: 123 }

    it('successfully adds a charge', async () => {
      mockChargeRepository.add.mockResolvedValue(sampleCharge)
      const service = chargeService(mockChargeRepository)
      await expect(service.createCharge(sampleCharge)).resolves.toEqual(sampleCharge)
    })

    it('throws an error when addition fails', async () => {
      mockChargeRepository.add.mockRejectedValue(new Error('Addition failed'))
      const service = chargeService(mockChargeRepository)
      await expect(service.createCharge(sampleCharge)).rejects.toThrow(EntityInsertionIntoDatabaseFailed)
    })
  })

  describe('retriveAllUserCharges', () => {
    const charges = [{ id: 1, amount: 100, userId: 123 }, { id: 2, amount: 200, userId: 123 }]

    it('returns all charges for a user', async () => {
      mockChargeRepository.findByUserId.mockResolvedValue(charges)
      const service = chargeService(mockChargeRepository)
      await expect(service.retriveAllUserCharges(123)).resolves.toEqual(charges)
    })
  })
})
