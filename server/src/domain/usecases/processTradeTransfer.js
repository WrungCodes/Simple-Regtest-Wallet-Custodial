import { InsuffientBankBalanceError } from '../../errors/trade.error.js'
import math from '../../external/math.js'

export default function processTradeTransfer (
  getOrGenerateUserWalletAndAddressUseCase,
  getBankBalanceUsecase,
  chargeService,
  transferService,
  cryptoStrategyImplem,
  rateImpl
) {
  const execute = async (userId, assetId, bankId, amount) => {
    const walletAssetAndAddress = await getWalletAssetAndAddressObject(userId, assetId)
    const accountBalance = await getAndComputeTotalAvailableAccountBalance(userId, bankId)
    validateThatUserHasEnoughBalance(amount, accountBalance)
    const charge = await createInitializeAndReturnChargeOnBank(bankId, userId, amount)
    const { rate, amountInCryptoCurrency } = await getAmountAndTradeRate(amount, walletAssetAndAddress.asset.symbol)
    const transactionDatails = await createAndSendOutTransfer(
      assetId,
      charge.id,
      walletAssetAndAddress.asset.symbol,
      walletAssetAndAddress.address,
      amountInCryptoCurrency,
      rate
    )
    return transactionDatails
  }

  const getWalletAssetAndAddressObject = async (userId, assetId) => {
    const walletAssetAndAddress = await getOrGenerateUserWalletAndAddressUseCase.execute(userId, assetId)
    return walletAssetAndAddress
  }

  const getAndComputeTotalAvailableAccountBalance = async (userId, bankId) => {
    const accountBalance = await getBankBalanceUsecase.execute(userId, bankId)
    return accountBalance
  }

  const validateThatUserHasEnoughBalance = (amount, balance) => {
    if (math.isGreaterThan(amount, balance)) {
      throw new InsuffientBankBalanceError(400, 'Insuffient Funds to carry out trade')
    }
  }

  const createInitializeAndReturnChargeOnBank = async (bankId, userId, amount) => {
    const charge = await chargeService.createCharge({
      bankId,
      userId,
      amount,
      currency: 'USD',
      timestamp: Date.now()
    })
    return charge
  }

  const getAmountAndTradeRate = async (amount, symbol) => {
    const rate = await rateImpl(symbol)
    const amountInCryptoCurrency = math.divide(amount, rate)
    return { rate, amountInCryptoCurrency }
  }

  const createAndSendOutTransfer = async (assetId, chargeId, symbol, address, amount, rate) => {
    const transfer = await transferService.createTransfer({
      assetId,
      chargeId,
      address,
      amount,
      rate,
      status: 'transaction_initizialized'
    })

    const transaction = await cryptoStrategyImplem(symbol).transfer(address, amount)
    await transferService.updateTransfer({ id: transfer.id, hash: transaction.hash, status: 'transaction_sent' })
    return { hash: transaction.hash, symbol, address }
  }

  return { execute }
}
