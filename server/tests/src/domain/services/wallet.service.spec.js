import walletService from '../../../../src/domain/services/wallet.service.js'
import { EntityNotFoundInDatabase, EntityInsertionIntoDatabaseFailed } from '../../../../src/errors/database.errors.js'

describe('walletService', () => {
  let mockWalletRepository
  let service

  const wallet = { id: 1, userId: 1, assetId: 1, balance: 100 }
  beforeEach(() => {
    mockWalletRepository = {
      add: jest.fn(),
      findByUserIdAndAssetId: jest.fn(),
      findById: jest.fn(),
      updateWalletBalance: jest.fn(),
      findWalletTransactionByHashAndVout: jest.fn()
    }

    service = walletService(mockWalletRepository)
    jest.clearAllMocks()
  })

  it('createWallet inserts wallet and returns inserted wallet', async () => {
    mockWalletRepository.add.mockResolvedValue(wallet)
    const result = await service.createWallet(wallet)
    expect(mockWalletRepository.add).toHaveBeenCalledWith(wallet)
    expect(result).toEqual(wallet)
  })

  it('createWallet throws EntityInsertionIntoDatabaseFailed on error', async () => {
    mockWalletRepository.add.mockRejectedValue(new Error('Insert failed'))
    await expect(service.createWallet(wallet)).rejects.toThrow(EntityInsertionIntoDatabaseFailed)
  })

  it('retriveWalletByUserIdAndAssetId returns wallet for valid userId and assetId', async () => {
    mockWalletRepository.findByUserIdAndAssetId.mockResolvedValue(wallet)
    const result = await service.retriveWalletByUserIdAndAssetId(wallet.userId, wallet.assetId)
    expect(result).toEqual(wallet)
  })

  it('retriveWalletByUserIdAndAssetId throws EntityNotFoundInDatabase if wallet not found', async () => {
    mockWalletRepository.findByUserIdAndAssetId.mockResolvedValue(null)
    await expect(service.retriveWalletByUserIdAndAssetId(wallet.userId, wallet.assetId)).rejects.toThrow(EntityNotFoundInDatabase)
  })

  it('retriveWalletById returns wallet for valid id', async () => {
    mockWalletRepository.findById.mockResolvedValue(wallet)
    const result = await service.retriveWalletById(wallet.id)
    expect(result).toEqual(wallet)
  })

  it('retriveWalletById throws EntityNotFoundInDatabase if wallet not found', async () => {
    mockWalletRepository.findById.mockResolvedValue(null)
    await expect(service.retriveWalletById(wallet.id)).rejects.toThrow(EntityNotFoundInDatabase)
  })

  it('updateWalletBalance updates wallet balance and returns boolean', async () => {
    mockWalletRepository.updateWalletBalance.mockResolvedValue(true)
    await service.updateWalletBalance(wallet, {})
    expect(mockWalletRepository.updateWalletBalance).toHaveBeenCalledWith(wallet, {})
  })

  it('updateWalletBalance throws EntityInsertionIntoDatabaseFailed on error', async () => {
    mockWalletRepository.updateWalletBalance.mockResolvedValue(false)
    await expect(service.updateWalletBalance(wallet, {})).rejects.toThrow(EntityInsertionIntoDatabaseFailed)
  })

  it('retriveWalletTransactionByHashAndVout returns wallet transaction for valid hash and vout', async () => {
    mockWalletRepository.findWalletTransactionByHashAndVout.mockResolvedValue(wallet)
    const result = await service.retriveWalletTransactionByHashAndVout('randomhash', 1)
    expect(result).toEqual(wallet)
  })

  it('retriveWalletTransactionByHashAndVout throws EntityNotFoundInDatabase if wallet transaction not found', async () => {
    mockWalletRepository.findWalletTransactionByHashAndVout.mockResolvedValue(null)
    await expect(service.retriveWalletTransactionByHashAndVout('randomhash', 1)).rejects.toThrow(EntityNotFoundInDatabase)
  })
})
