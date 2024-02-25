import getOrGenerateUserWalletAndAddress from '../../domain/usecases/getOrGenerateUserWalletAndAddress.js'

export default function assetController (assetService, walletService, addressService, cryptoStrategyImplem, encryptionImplem, rateImpl) {
  const getAssets = async (req, res, next) => {
    const assets = await assetService.retriveAllCryptoAssets()
    res.json({ assets })
  }

  const getAssetRate = async (req, res, next) => {
    const assetId = parseInt(req.params.id)
    const asset = await assetService.retriveAssetById(assetId)
    const rate = await rateImpl(asset.symbol)
    res.json({ ...asset, rate })
  }

  const getUserWalletAndAddress = async (req, res, next) => {
    const { id } = res.locals.user
    const assetId = parseInt(req.params.id)

    const getOrGenerateUserWalletAndAddressUseCase =
      getOrGenerateUserWalletAndAddress(
        assetService,
        walletService,
        addressService,
        cryptoStrategyImplem,
        encryptionImplem
      )
    const asset = await getOrGenerateUserWalletAndAddressUseCase.execute(id, assetId)
    res.json({ ...asset })
  }

  return {
    getAssets,
    getAssetRate,
    getUserWalletAndAddress
  }
}
