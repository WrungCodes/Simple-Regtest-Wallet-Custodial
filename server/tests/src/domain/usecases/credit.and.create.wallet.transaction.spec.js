import creditAndCreateWalletTransaction from '../../../../src/domain/usecases/creditAndCreateWalletTransaction.js'
import { EntityNotFoundInDatabase } from '../../../../src/errors/database.errors.js'
import { DuplicateWalletTransactionError } from '../../../../src/errors/trade.error.js'

const mockCryptoGetTransaction = jest.fn()

describe('creditAndCreateWalletTransaction', () => {
  const mockWalletService = {
    retriveWalletById: jest.fn(),
    updateWalletBalance: jest.fn(),
    retriveWalletTransactionByHashAndVout: jest.fn()
  }
  const mockAddressService = {
    retriveAddressByAddressString: jest.fn()
  }
  const mockCryptoImpl = () => {
    return {
      getTransactionByHash: mockCryptoGetTransaction
    }
  }

  const symbol = 'BTC'
  const hash = 'testhash'
  const address = 'testaddress'
  const transaction = { hash, vout: 0, amount: 100 }
  const wallet = { id: 'walletId', balance: 200 }
  const addressWallet = { walletId: wallet.id }

  beforeEach(() => {
    jest.clearAllMocks()
    mockWalletService.retriveWalletById.mockResolvedValue(wallet)
    mockAddressService.retriveAddressByAddressString.mockResolvedValue(addressWallet)
    mockCryptoGetTransaction.mockResolvedValue([transaction])
    mockWalletService.retriveWalletTransactionByHashAndVout.mockRejectedValue(new EntityNotFoundInDatabase())
  })

  it('successfully credits wallet and creates transaction', async () => {
    const { execute } = creditAndCreateWalletTransaction(mockWalletService, mockAddressService, mockCryptoImpl)

    await execute(symbol, hash, address)

    expect(mockWalletService.updateWalletBalance).toHaveBeenCalledWith({
      id: wallet.id,
      balance: (wallet.balance + transaction.amount).toString()
    }, expect.anything())
  })

  it('skips duplicate wallet transactions', async () => {
    mockWalletService.retriveWalletTransactionByHashAndVout.mockRejectedValue(new DuplicateWalletTransactionError())

    const { execute } = creditAndCreateWalletTransaction(mockWalletService, mockAddressService, mockCryptoImpl)

    await execute(symbol, hash, address)

    expect(mockWalletService.updateWalletBalance).not.toHaveBeenCalled()
  })

  it('throws error on unexpected wallet transaction retrieval error', async () => {
    const unexpectedError = new Error('Unexpected error')
    mockWalletService.retriveWalletTransactionByHashAndVout.mockRejectedValue(unexpectedError)
    const { execute } = creditAndCreateWalletTransaction(mockWalletService, mockAddressService, mockCryptoImpl)
    await expect(execute(symbol, hash, address)).resolves.not.toThrow()
  })
})
