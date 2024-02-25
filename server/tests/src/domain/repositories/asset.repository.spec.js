import assetRepository from '../../../../src/domain/repositories/asset.repository.js'

describe('assetRepository', () => {
  let mockRepository
  let repo

  beforeEach(() => {
    mockRepository = {
      findManyBy: jest.fn(),
      findById: jest.fn(),
      insert: jest.fn()
    }
    repo = assetRepository(mockRepository)
  })

  it('findByType calls repository with correct type', async () => {
    const type = 'type1'
    await repo.findByType(type)
    expect(mockRepository.findManyBy).toHaveBeenCalledWith('type', type)
  })

  it('findById calls repository with correct id', async () => {
    const id = 1
    await repo.findById(id)
    expect(mockRepository.findById).toHaveBeenCalledWith(id)
  })

  it('add inserts asset correctly', async () => {
    const asset = { type: 'type2', name: 'Asset Name 2' }
    await repo.add(asset)
    expect(mockRepository.insert).toHaveBeenCalledWith(asset)
  })
})
