import { EntityNotFoundInDatabase, EntityInsertionIntoDatabaseFailed } from '../../errors/database.errors.js'

export default function walletService (walletRepository) {
  const createWallet = async (wallet) => {
    try {
      const insertedWallet = await walletRepository.add(wallet)
      return insertedWallet
    } catch (error) {
      throw new EntityInsertionIntoDatabaseFailed(500, 'Unable to insert Wallet into database')
    }
  }

  const updateWalletBalance = async (wallet, transaction) => {
    const isSuccessful = await walletRepository.updateWalletBalance(wallet, transaction)
    if (!isSuccessful) {
      throw new EntityInsertionIntoDatabaseFailed(500, 'Unable to Update Wallet or Insert Wallet Transaction into database')
    }
  }

  const retriveWalletByUserIdAndAssetId = async (userId, assetId) => {
    const wallet = await walletRepository.findByUserIdAndAssetId(userId, assetId)
    if (!wallet) {
      throw new EntityNotFoundInDatabase(400, 'Wallet not found using userId and assetId')
    }
    return wallet
  }

  const retriveWalletTransactionByHashAndVout = async (hash, vout) => {
    const transaction = await walletRepository.findWalletTransactionByHashAndVout(hash, vout)
    if (!transaction) {
      throw new EntityNotFoundInDatabase(400, 'Wallet Transaction not found using hash and vout')
    }
    return transaction
  }

  const retriveWalletById = async (id) => {
    const wallet = await walletRepository.findById(id)
    if (!wallet) {
      throw new EntityNotFoundInDatabase(400, 'Wallet not found using id')
    }
    return wallet
  }

  return Object.freeze({
    createWallet,
    retriveWalletById,
    updateWalletBalance,
    retriveWalletByUserIdAndAssetId,
    retriveWalletTransactionByHashAndVout
  })
}
