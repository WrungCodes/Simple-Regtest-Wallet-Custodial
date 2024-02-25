import assetService from '../../../../src/domain/services/asset.service.js'
import { EntityNotFoundInDatabase } from '../../../../src/errors/database.errors.js'

describe('assetService', () => {
  let mockAssetRepository
  let service

  beforeEach(() => {
    mockAssetRepository = {
      findById: jest.fn(),
      findByType: jest.fn()
    }

    service = assetService(mockAssetRepository)
  })

  it('retriveAssetById throws EntityNotFoundInDatabase if asset not found', async () => {
    mockAssetRepository.findById.mockResolvedValue(null)
    await expect(service.retriveAssetById(123)).rejects.toThrow(EntityNotFoundInDatabase)
  })

  it('retriveAssetById returns asset for valid id', async () => {
    const asset = { id: 123, type: 'crypto', name: 'Bitcoin', symbol: 'BTC' }
    mockAssetRepository.findById.mockResolvedValue(asset)
    const result = await service.retriveAssetById(123)
    expect(result).toEqual(asset)
  })

  it('retriveAllCryptoAssets returns array of crypto assets', async () => {
    const assets = [{ id: 123, type: 'crypto', name: 'Bitcoin', symbol: 'BTC' }]
    mockAssetRepository.findByType.mockResolvedValue(assets)
    const result = await service.retriveAllCryptoAssets()
    expect(result).toEqual(assets)
  })
})
