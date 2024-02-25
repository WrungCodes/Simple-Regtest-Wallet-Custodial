export default function addressRepository (dbRepository) {
  const findByWalletId = async (walletId) => dbRepository.findBy('walletId', walletId)
  const findByAddress = async (address) => dbRepository.findBy('address', address)
  const findById = async (id) => dbRepository.findById(id)
  const add = async (asset) => dbRepository.insert(asset)

  return Object.freeze({
    findByWalletId,
    findByAddress,
    findById,
    add
  })
}
