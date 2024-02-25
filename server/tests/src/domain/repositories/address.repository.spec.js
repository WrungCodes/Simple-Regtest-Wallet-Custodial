import addressRepository from '../../../../src/domain/repositories/address.repository.js'

describe('addressRepository', () => {
  let mockRepository
  let repo

  beforeEach(() => {
    mockRepository = {
      findBy: jest.fn(),
      findById: jest.fn(),
      insert: jest.fn()
    }
    repo = addressRepository(mockRepository)
  })

  it('findByWalletId calls repository with correct walletId', async () => {
    const walletId = 1
    await repo.findByWalletId(walletId)
    expect(mockRepository.findBy).toHaveBeenCalledWith('walletId', walletId)
  })

  it('findById calls repository with correct id', async () => {
    const id = 1
    await repo.findById(id)
    expect(mockRepository.findById).toHaveBeenCalledWith(id)
  })

  it('add inserts address correctly', async () => {
    const address = { walletId: 2, address: 'Address 1' }
    await repo.add(address)
    expect(mockRepository.insert).toHaveBeenCalledWith(address)
  })
})
