import { EntityNotFoundInDatabase } from '../../errors/database.errors.js'
import { DuplicateWalletTransactionError } from '../../errors/trade.error.js'
import math from '../../external/math.js'

export default function creditAndCreateWalletTransaction (walletService, addressService, cryptoImpl) {
  const execute = async (symbol, hash, address) => {
    const addressWallet = await addressService.retriveAddressByAddressString(address)
    const blockchainTransaction = await cryptoImpl(symbol).getTransactionByHash(hash)

    for (const transaction of blockchainTransaction) {
      try {
        const walletTransactionObject = await getOrCreateWalletTransaction(transaction, addressWallet.walletId)
        const wallet = await walletService.retriveWalletById(addressWallet.walletId)
        await updateWalletWithNewBalanceAndCreateWalletTransaction(wallet, walletTransactionObject)
      } catch (error) {
        continue
      }
    }
  }

  const getOrCreateWalletTransaction = async (transaction, walletId) => {
    try {
      await walletService.retriveWalletTransactionByHashAndVout(transaction.hash, transaction.vout)
      throw new DuplicateWalletTransactionError(400, 'Wallet Transaction already exists with the given hash and vout')
    } catch (error) {
      if (error instanceof EntityNotFoundInDatabase) {
        return {
          walletId,
          hash: transaction.hash,
          vout: transaction.vout,
          amount: transaction.amount
        }
      }
      throw error
    }
  }

  const updateWalletWithNewBalanceAndCreateWalletTransaction = async (wallet, transaction) => {
    const newWalletBalance = math.add(wallet.balance, transaction.amount)
    await walletService.updateWalletBalance({
      id: wallet.id,
      balance: newWalletBalance
    }, transaction)
  }

  return { execute }
}
