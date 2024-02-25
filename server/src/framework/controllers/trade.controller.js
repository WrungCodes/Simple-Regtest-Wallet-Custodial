import processTradeTransfer from '../../domain/usecases/processTradeTransfer.js'
import getOrGenerateUserWalletAndAddress from '../../domain/usecases/getOrGenerateUserWalletAndAddress.js'
import getBankBalance from '../../domain/usecases/getBankBalance.js'
import cryptoSendEvent from '../../events/crypto.send.event.js'

export default function tradeController (
  assetService,
  walletService,
  addressService,
  bankService,
  chargeService,
  transferService,
  cryptoStrategyImplem,
  encryptionImplem,
  plaidImpl,
  rateImpl
) {
  const processTrade = async (req, res, next) => {
    const userId = res.locals.user.id
    const { assetId, bankId, amount } = req.body

    const { getOrGenerateUserWalletAndAddressUseCase, getBankBalanceUsecase } = resolveUsecaseToUseForTradeTransfer()

    const processTradeTransactionUseCase = processTradeTransfer(
      getOrGenerateUserWalletAndAddressUseCase,
      getBankBalanceUsecase,
      chargeService,
      transferService,
      cryptoStrategyImplem,
      rateImpl
    )

    const transferDatails = await processTradeTransactionUseCase.execute(userId, assetId, bankId, amount)
    res.json({ transferDatails })

    cryptoSendEvent.emit('send', {
      symbol: transferDatails.asset.symbol,
      hash: transferDatails.hash,
      address: transferDatails.address
    })
  }

  const resolveUsecaseToUseForTradeTransfer = () => {
    const getOrGenerateUserWalletAndAddressUseCase =
    getOrGenerateUserWalletAndAddress(
      assetService,
      walletService,
      addressService,
      cryptoStrategyImplem,
      encryptionImplem
    )

    const getBankBalanceUsecase = getBankBalance(bankService, plaidImpl)

    return {
      getOrGenerateUserWalletAndAddressUseCase,
      getBankBalanceUsecase
    }
  }

  return {
    processTrade
  }
}
