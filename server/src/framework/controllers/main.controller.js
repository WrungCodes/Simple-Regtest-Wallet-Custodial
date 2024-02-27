import getOrGenerateUserWalletAndAddress from '../../domain/usecases/getOrGenerateUserWalletAndAddress.js'
import getBanksAccount from '../../domain/usecases/getBanksAccount.js'

export default function mainController (assetService, walletService, addressService, bankService, cryptoStrategyImplem, encryptionImplem, plaidImpl) {
  const loadUserData = async (req, res, next) => {
    const user = res.locals.user

    // we do this because it is not yet dynamic and we only support BTC
    // in the future we will support other assets and make if dynamic
    const allAssets = await assetService.retriveAllCryptoAssets()
    const btcAsset = allAssets[0]

    const getOrGenerateUserWalletAndAddressUseCase =
    getOrGenerateUserWalletAndAddress(
      assetService,
      walletService,
      addressService,
      cryptoStrategyImplem,
      encryptionImplem
    )
    const walletAssetAndAddress = await getOrGenerateUserWalletAndAddressUseCase.execute(user.id, btcAsset.id)

    const getBanksAccountUsecase = getBanksAccount(bankService, plaidImpl)
    const accounts = await getBanksAccountUsecase.execute(user.id)

    res.json({ user, accounts, wallet: walletAssetAndAddress })
  }

  return {
    loadUserData
  }
}
