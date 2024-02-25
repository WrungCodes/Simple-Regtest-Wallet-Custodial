import addressService from '../../../../src/domain/services/address.service.js'
import { EntityNotFoundInDatabase, EntityInsertionIntoDatabaseFailed } from '../../../../src/errors/database.errors.js'

describe('addressService', () => {
  let mockAddressRepository
  let service

  beforeEach(() => {
    mockAddressRepository = {
      add: jest.fn(),
      findByAddress: jest.fn(),
      findByWalletId: jest.fn()
    }
    service = addressService(mockAddressRepository)
  })

  describe('createAddress', () => {
    const address = { walletId: 1, address: 'bitcoin-address' }

    it('successfully creates an address', async () => {
      mockAddressRepository.add.mockResolvedValue(address)
      const result = await service.createAddress(address)
      expect(mockAddressRepository.add).toHaveBeenCalledWith(address)
      expect(result).toEqual(address)
    })

    it('throws EntityInsertionIntoDatabaseFailed on failure', async () => {
      mockAddressRepository.add.mockRejectedValue(new Error('Insert failed'))
      await expect(service.createAddress(address)).rejects.toThrow(EntityInsertionIntoDatabaseFailed)
    })
  })

  describe('retriveAddressByAddressString', () => {
    const suppliedAddress = 'bitcoin-address'

    it('retrieves an address by address string', async () => {
      mockAddressRepository.findByAddress.mockResolvedValue(suppliedAddress)
      const result = await service.retriveAddressByAddressString(suppliedAddress)
      expect(result).toEqual(suppliedAddress)
    })

    it('throws EntityNotFoundInDatabase if address not found', async () => {
      mockAddressRepository.findByAddress.mockResolvedValue(null)
      await expect(service.retriveAddressByAddressString(suppliedAddress)).rejects.toThrow(EntityNotFoundInDatabase)
    })
  })

  describe('retriveAddressForWallet', () => {
    const walletId = 1

    it('retrieves an address for a given walletId', async () => {
      mockAddressRepository.findByWalletId.mockResolvedValue({ walletId, address: 'bitcoin-address' })
      const result = await service.retriveAddressForWallet(walletId)
      expect(result).toHaveProperty('walletId', walletId)
    })

    it('throws EntityNotFoundInDatabase if address not found for walletId', async () => {
      mockAddressRepository.findByWalletId.mockResolvedValue(null)
      await expect(service.retriveAddressForWallet(walletId)).rejects.toThrow(EntityNotFoundInDatabase)
    })
  })
})
