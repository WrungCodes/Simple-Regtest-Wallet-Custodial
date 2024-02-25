import { EntityNotFoundInDatabase } from '../../errors/database.errors.js'

export default function assetService (assetRepository) {
  const retriveAssetById = async (id) => {
    const asset = await assetRepository.findById(id)
    if (!asset) {
      throw new EntityNotFoundInDatabase(400, 'Asset not found using id')
    }
    return asset
  }

  const retriveAllCryptoAssets = async () => {
    const assets = await assetRepository.findByType('crypto')
    return assets
  }

  return Object.freeze({
    retriveAssetById,
    retriveAllCryptoAssets
  })
}
