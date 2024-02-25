import processTradeTransfer from '../../../../src/domain/usecases/processTradeTransfer.js'
import { InsuffientBankBalanceError } from '../../../../src/errors/trade.error.js'

const mockCryptoTransfer = jest.fn()

describe('processTradeTransfer', () => {
  let getOrGenerateUserWalletAndAddressUseCase, getBankBalanceUsecase, chargeService, transferService, cryptoStrategyImplem, rateImpl

  beforeEach(() => {
    getOrGenerateUserWalletAndAddressUseCase = { execute: jest.fn() }
    getBankBalanceUsecase = { execute: jest.fn() }
    chargeService = { createCharge: jest.fn() }
    transferService = { createTransfer: jest.fn(), updateTransfer: jest.fn() }
    cryptoStrategyImplem = () => {
      return {
        transfer: mockCryptoTransfer
      }
    }
    rateImpl = jest.fn()

    getOrGenerateUserWalletAndAddressUseCase.execute.mockResolvedValue({ asset: { symbol: 'BTC' }, address: 'bitcoinAddress' })
    getBankBalanceUsecase.execute.mockResolvedValue(1000)
    chargeService.createCharge.mockResolvedValue({ id: 1 })
    transferService.createTransfer.mockResolvedValue({ id: 2 })
    transferService.updateTransfer.mockResolvedValue({})
    mockCryptoTransfer.mockResolvedValue({ hash: 'txHash' })
    rateImpl.mockResolvedValue('50')

    const _GLOBAL = global
    _GLOBAL.Date.now = () => 1708787908890
  })

  it('executes trade transfer successfully', async () => {
    const userId = 123
    const assetId = 456
    const bankId = 789
    const amount = '500'
    const chargeId = 1
    const address = 'bitcoinAddress'
    const rate = '50'
    const amountInCryptoCurrency = '10'

    const transactionDetails = await processTradeTransfer(
      getOrGenerateUserWalletAndAddressUseCase,
      getBankBalanceUsecase,
      chargeService,
      transferService,
      cryptoStrategyImplem,
      rateImpl
    ).execute(userId, assetId, bankId, amount)

    expect(getOrGenerateUserWalletAndAddressUseCase.execute).toHaveBeenCalledWith(userId, assetId)
    expect(getBankBalanceUsecase.execute).toHaveBeenCalledWith(bankId)
    expect(chargeService.createCharge).toHaveBeenCalledWith({ amount, bankId, currency: 'USD', timestamp: 1708787908890, userId })
    expect(transferService.createTransfer).toHaveBeenCalledWith({
      assetId,
      chargeId,
      address,
      amount: amountInCryptoCurrency,
      rate,
      status: 'transaction_initizialized'
    })
    expect(mockCryptoTransfer).toHaveBeenCalledWith('bitcoinAddress', amountInCryptoCurrency)
    expect(transferService.updateTransfer).toHaveBeenCalledWith({ id: 2, hash: 'txHash', status: 'transaction_sent' })
    expect(transactionDetails).toMatchObject({ hash: 'txHash' })
  })

  it('throws an error if the account balance is insufficient', async () => {
    getBankBalanceUsecase.execute.mockResolvedValue('100')
    const userId = 123
    const assetId = 456
    const bankId = 789
    const amount = '500'

    await expect(processTradeTransfer(
      getOrGenerateUserWalletAndAddressUseCase,
      getBankBalanceUsecase,
      chargeService,
      transferService,
      cryptoStrategyImplem,
      rateImpl
    ).execute(userId, assetId, bankId, amount)).rejects.toThrow(InsuffientBankBalanceError)
  })

  it('throws an error if charge creation fails', async () => {
    chargeService.createCharge.mockRejectedValue(new Error('Charge creation failed'))
    const userId = 123
    const assetId = 456
    const bankId = 789
    const amount = '500'

    await expect(processTradeTransfer(
      getOrGenerateUserWalletAndAddressUseCase,
      getBankBalanceUsecase,
      chargeService,
      transferService,
      cryptoStrategyImplem,
      rateImpl
    ).execute(userId, assetId, bankId, amount)).rejects.toThrow('Charge creation failed')
  })

  it('throws an error during transfer process', async () => {
    mockCryptoTransfer.mockRejectedValue(new Error('Transfer failed'))
    const userId = 123
    const assetId = 456
    const bankId = 789
    const amount = '500'

    await expect(processTradeTransfer(
      getOrGenerateUserWalletAndAddressUseCase,
      getBankBalanceUsecase,
      chargeService,
      transferService,
      cryptoStrategyImplem,
      rateImpl
    ).execute(userId, assetId, bankId, amount)).rejects.toThrow('Transfer failed')
  })
})
