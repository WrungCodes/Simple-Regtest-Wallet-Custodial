import { EntityNotFoundInDatabase } from '../../errors/database.errors.js'

export default function getOrGenerateUserWalletAndAddress (assetService, walletService, addressService, cryptoAddressImpl, encryptionImpl) {
  const execute = async (userId, assetId) => {
    const asset = await assetService.retriveAssetById(assetId)
    const wallet = await retriveOrCreateAssetWalletForUser(userId, assetId)
    const address = await retriveOrGenerateAddressforWallet(asset.symbol, wallet.id)
    return formatReturnValues(asset, wallet, address)
  }

  const retriveOrCreateAssetWalletForUser = async (userId, assetId) => {
    try {
      return await walletService.retriveWalletByUserIdAndAssetId(userId, assetId)
    } catch (error) {
      return await createWalletIfEntityNotFound(error, userId, assetId)
    }
  }

  const createWalletIfEntityNotFound = async (error, userId, assetId) => {
    if (error instanceof EntityNotFoundInDatabase) {
      return await walletService.createWallet({ userId, assetId, balance: '0.0' })
    }
    throw error
  }

  const retriveOrGenerateAddressforWallet = async (symbol, walletId) => {
    try {
      return await addressService.retriveAddressForWallet(walletId)
    } catch (error) {
      return await generateAndCreateAddressIfAddressNotFound(error, symbol, walletId)
    }
  }

  const generateAndCreateAddressIfAddressNotFound = async (error, symbol, walletId) => {
    if (error instanceof EntityNotFoundInDatabase) {
      const keypair = await generateCryptoAddress(symbol)
      const address = await createAndInsertAddress(walletId, keypair)
      return address
    }
    throw error
  }

  const generateCryptoAddress = async (symbol) => {
    const { address, privateKey } = await cryptoAddressImpl(symbol).generateAddress()
    return { address, privateKey }
  }

  const createAndInsertAddress = async (walletId, keypair) => {
    const { address, privateKey } = keypair
    return await addressService.createAddress({ walletId, address, privateKey: encryptionImpl.encrypt(privateKey) })
  }

  const formatReturnValues = (asset, wallet, address) => {
    return {
      ...wallet,
      asset,
      address: address.address
    }
  }

  return { execute }
}
