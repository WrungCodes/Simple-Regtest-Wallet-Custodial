import bankService from '../../../../src/domain/services/bank.service.js'
import { EntityNotFoundInDatabase, EntityInsertionIntoDatabaseFailed } from '../../../../src/errors/database.errors.js'

describe('bankService', () => {
  let mockBankRepository

  beforeEach(() => {
    mockBankRepository = {
      add: jest.fn(),
      findById: jest.fn(),
      addMultiple: jest.fn(),
      findByUserId: jest.fn()
    }
  })

  describe('createBank', () => {
    const sampleBank = { id: 1, name: 'Test Bank' }

    it('successfully inserts a bank', async () => {
      mockBankRepository.add.mockResolvedValue(sampleBank)
      const service = bankService(mockBankRepository)
      await expect(service.createBank(sampleBank)).resolves.toEqual(sampleBank)
    })

    it('throws an error when insertion fails', async () => {
      mockBankRepository.add.mockRejectedValue(new Error('Insertion failed'))
      const service = bankService(mockBankRepository)
      await expect(service.createBank(sampleBank)).rejects.toThrow(EntityInsertionIntoDatabaseFailed)
    })
  })

  describe('createMultipleBank', () => {
    const sampleBanks = [{ id: 1, name: 'Test Bank' }, { id: 2, name: 'Test Bank 2' }]

    it('successfully inserts a bank', async () => {
      mockBankRepository.addMultiple.mockResolvedValue(true)
      const service = bankService(mockBankRepository)
      await expect(service.createMultipleBank(sampleBanks)).resolves.not.toThrow(EntityInsertionIntoDatabaseFailed)
    })

    it('throws an error when insertion fails', async () => {
      mockBankRepository.addMultiple.mockResolvedValue(false)
      const service = bankService(mockBankRepository)
      await expect(service.createMultipleBank(sampleBanks)).rejects.toThrow(EntityInsertionIntoDatabaseFailed)
    })
  })

  describe('retriveBankById', () => {
    const sampleBank = { id: 1, name: 'Test Bank' }

    it('returns a bank for a valid id', async () => {
      mockBankRepository.findById.mockResolvedValue(sampleBank)
      const service = bankService(mockBankRepository)
      await expect(service.retriveBankById(1)).resolves.toEqual(sampleBank)
    })

    it('throws an error when no bank is found', async () => {
      mockBankRepository.findById.mockResolvedValue(null)
      const service = bankService(mockBankRepository)
      await expect(service.retriveBankById(1)).rejects.toThrow(EntityNotFoundInDatabase)
    })
  })

  describe('retriveAllUserBanks', () => {
    const banks = [{ id: 1, name: 'Test Bank' }, { id: 2, name: 'Another Bank' }]

    it('returns all banks for a user', async () => {
      mockBankRepository.findByUserId.mockResolvedValue(banks)
      const service = bankService(mockBankRepository)
      await expect(service.retriveAllUserBanks(123)).resolves.toEqual(banks)
    })
  })
})
