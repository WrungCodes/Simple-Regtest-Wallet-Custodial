import transferService from '../../../../src/domain/services/transfer.service.js'
import { EntityInsertionIntoDatabaseFailed } from '../../../../src/errors/database.errors.js'

describe('transferService', () => {
  let transferRepository
  let service

  beforeEach(() => {
    transferRepository = {
      add: jest.fn(),
      update: jest.fn()
    }

    service = transferService(transferRepository)
  })

  describe('createTransfer', () => {
    it('successfully creates a transfer', async () => {
      const mockTransfer = { id: '123', amount: 100 }
      transferRepository.add.mockResolvedValue(mockTransfer)

      const result = await service.createTransfer(mockTransfer)

      expect(transferRepository.add).toHaveBeenCalledWith(mockTransfer)
      expect(result).toEqual(mockTransfer)
    })

    it('throws an error when transfer creation fails', async () => {
      const mockTransfer = { id: '123', amount: 100 }
      transferRepository.add.mockRejectedValue(new Error('DB error'))

      await expect(service.createTransfer(mockTransfer))
        .rejects.toThrow(EntityInsertionIntoDatabaseFailed)
    })
  })

  describe('updateTransfer', () => {
    it('successfully updates a transfer', async () => {
      const mockTransfer = { id: '123', amount: 100 }
      transferRepository.update.mockResolvedValue(undefined)

      await service.updateTransfer(mockTransfer)

      expect(transferRepository.update).toHaveBeenCalledWith(mockTransfer)
    })

    it('throws an error when transfer update fails', async () => {
      const mockTransfer = { id: '123', amount: 100 }
      transferRepository.update.mockRejectedValue(new Error('DB error'))

      await expect(service.updateTransfer(mockTransfer))
        .rejects.toThrow('Unable to update Transfer into database')
    })
  })
})
