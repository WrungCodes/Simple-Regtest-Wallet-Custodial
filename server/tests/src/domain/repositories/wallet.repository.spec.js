import walletRepository from '../../../../src/domain/repositories/wallet.repository.js'

describe('walletRepository', () => {
  let mockRepository
  let repo

  beforeEach(() => {
    mockRepository = {
      findOneWalletTransactionByMany: jest.fn(),
      updateWalletBalance: jest.fn(),
      findManyByMany: jest.fn(),
      findOneByMany: jest.fn(),
      findManyBy: jest.fn(),
      findById: jest.fn(),
      insert: jest.fn()
    }
    repo = walletRepository(mockRepository)
  })

  it('findByUserIdAndAssetId calls repository with correct parameters', async () => {
    const userId = 1; const assetId = 1
    await repo.findByUserIdAndAssetId(userId, assetId)
    expect(mockRepository.findOneByMany).toHaveBeenCalledWith([{ userId }, { assetId }])
  })

  it('findByUserId calls repository with correct userId', async () => {
    const userId = 2
    await repo.findByUserId(userId)
    expect(mockRepository.findManyBy).toHaveBeenCalledWith('userId', userId)
  })

  it('findById calls repository with correct id', async () => {
    const id = 1
    await repo.findById(id)
    expect(mockRepository.findById).toHaveBeenCalledWith(id)
  })

  it('add inserts asset correctly', async () => {
    const asset = { name: 'Asset Name', userId: 3, assetId: 2 }
    await repo.add(asset)
    expect(mockRepository.insert).toHaveBeenCalledWith(asset)
  })

  it('findWalletTransactionByHashAndVout calls repository with correct parameters', async () => {
    const hash = 'randomhash'; const vout = 1
    await repo.findWalletTransactionByHashAndVout(hash, vout)
    expect(mockRepository.findOneWalletTransactionByMany).toHaveBeenCalledWith([{ hash }, { vout }])
  })

  it('updateWalletBalance calls repository with correct parameters', async () => {
    const wallet = { id: 1 }; const transaction = {}
    await repo.updateWalletBalance(wallet, transaction)
    expect(mockRepository.updateWalletBalance).toHaveBeenCalledWith(wallet, transaction)
  })
})
