export default function walletRepository (dbRepository) {
  const findWalletTransactionByHashAndVout = async (hash, vout) => dbRepository.findOneWalletTransactionByMany([{ hash }, { vout }])
  const findByUserIdAndAssetId = async (userId, assetId) => dbRepository.findOneByMany([{ userId }, { assetId }])
  const updateWalletBalance = async (wallet, transaction) => dbRepository.updateWalletBalance(wallet, transaction)
  const findByUserId = async (userId) => dbRepository.findManyBy('userId', userId)
  const findById = async (id) => dbRepository.findById(id)
  const add = async (asset) => dbRepository.insert(asset)

  return Object.freeze({
    findWalletTransactionByHashAndVout,
    findByUserIdAndAssetId,
    updateWalletBalance,
    findByUserId,
    findById,
    add
  })
}
