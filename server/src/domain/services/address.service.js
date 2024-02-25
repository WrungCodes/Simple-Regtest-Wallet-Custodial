import { EntityNotFoundInDatabase, EntityInsertionIntoDatabaseFailed } from '../../errors/database.errors.js'

export default function addressService (addressRepository) {
  const createAddress = async (address) => {
    try {
      const insertedAddress = await addressRepository.add(address)
      return insertedAddress
    } catch (error) {
      throw new EntityInsertionIntoDatabaseFailed(500, 'Unable to insert insertedAddress into database')
    }
  }

  const retriveAddressByAddressString = async (suppliedAddress) => {
    const address = await addressRepository.findByAddress(suppliedAddress)
    if (!address) {
      throw new EntityNotFoundInDatabase(400, 'Address not found using address')
    }
    return address
  }

  const retriveAddressForWallet = async (walletId) => {
    const address = await addressRepository.findByWalletId(walletId)
    if (!address) {
      throw new EntityNotFoundInDatabase(400, 'Address not found using walletId')
    }
    return address
  }

  return Object.freeze({
    createAddress,
    retriveAddressForWallet,
    retriveAddressByAddressString
  })
}
