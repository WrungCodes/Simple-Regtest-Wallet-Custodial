import getOrGenerateUserWalletAndAddress from '../../../../src/domain/usecases/getOrGenerateUserWalletAndAddress.js'
import { EntityNotFoundInDatabase } from '../../../../src/errors/database.errors.js'

const mockGenerateAddress = jest.fn()

describe('getOrGenerateUserWalletAndAddress', () => {
  let walletService
  let addressService
  let assetService
  let cryptoAddressImpl
  let encryptionImpl

  const userId = 1
  const assetId = 1
  const wallet = { id: 1, userId, assetId, balance: '0.0' }
  const asset = { id: assetId, symbol: 'BTC' }
  const address = { walletId: wallet.id, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', privateKey: 'privateKey' }
  const hashedAddress = { walletId: wallet.id, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', privateKey: 'encryptedPrivateKey' }

  beforeEach(() => {
    walletService = {
      retriveWalletByUserIdAndAssetId: jest.fn(),
      createWallet: jest.fn()
    }
    addressService = {
      findByWalletId: jest.fn(),
      retriveAddressForWallet: jest.fn(),
      createAddress: jest.fn()
    }
    assetService = {
      retriveAssetById: jest.fn()
    }
    cryptoAddressImpl = () => {
      return {
        generateAddress: mockGenerateAddress
      }
    }
    encryptionImpl = {
      encrypt: jest.fn()
    }
  })

  it('successfully retrieves existing wallet and address', async () => {
    assetService.retriveAssetById.mockResolvedValue(asset)
    walletService.retriveWalletByUserIdAndAssetId.mockResolvedValue(wallet)
    addressService.retriveAddressForWallet.mockResolvedValue(address)

    const { execute } = getOrGenerateUserWalletAndAddress(assetService, walletService, addressService, cryptoAddressImpl, encryptionImpl)
    const result = await execute(userId, assetId)
    expect(result).toMatchObject({
      ...wallet,
      asset,
      address: address.address
    })
  })

  it('handles wallet not found and creates new wallet', async () => {
    assetService.retriveAssetById.mockResolvedValue(asset)
    walletService.retriveWalletByUserIdAndAssetId.mockRejectedValue(new EntityNotFoundInDatabase())
    walletService.createWallet.mockResolvedValue(wallet)
    addressService.retriveAddressForWallet.mockResolvedValue(address)

    const { execute } = getOrGenerateUserWalletAndAddress(assetService, walletService, addressService, cryptoAddressImpl, encryptionImpl)
    const result = await execute(userId, assetId)

    expect(walletService.createWallet).toHaveBeenCalledWith({ userId, assetId, balance: '0.0' })
    expect(result).toMatchObject({
      ...wallet,
      asset,
      address: address.address
    })
  })

  it('handles address not found and generates new address', async () => {
    assetService.retriveAssetById.mockResolvedValue(asset)
    walletService.retriveWalletByUserIdAndAssetId.mockResolvedValue(wallet)
    addressService.retriveAddressForWallet.mockRejectedValue(new EntityNotFoundInDatabase())
    mockGenerateAddress.mockResolvedValue({ address: address.address, privateKey: address.privateKey })
    encryptionImpl.encrypt.mockReturnValue(hashedAddress.privateKey)
    addressService.createAddress.mockResolvedValue(hashedAddress)

    const { execute } = getOrGenerateUserWalletAndAddress(assetService, walletService, addressService, cryptoAddressImpl, encryptionImpl)
    const result = await execute(userId, assetId)

    expect(mockGenerateAddress).toHaveBeenCalled()
    expect(encryptionImpl.encrypt).toHaveBeenCalledWith(address.privateKey)
    expect(addressService.createAddress).toHaveBeenCalledWith({ walletId: wallet.id, ...hashedAddress })
    expect(result).toMatchObject({
      ...wallet,
      asset,
      address: address.address
    })
  })
})
