import { EntityNotFoundInDatabase, EntityInsertionIntoDatabaseFailed } from '../../errors/database.errors.js'

export default function bankService (bankRepository) {
  const createBank = async (bank) => {
    try {
      const insertedBank = await bankRepository.add(bank)
      return insertedBank
    } catch (error) {
      throw new EntityInsertionIntoDatabaseFailed(500, 'Unable to insert Bank into database')
    }
  }

  const createMultipleBank = async (banks) => {
    const isInsertedBanks = await bankRepository.addMultiple(banks)
    if (!isInsertedBanks) {
      throw new EntityInsertionIntoDatabaseFailed(500, 'Unable to insert Banks into database')
    }
  }

  const retriveBankById = async (id) => {
    const bank = await bankRepository.findById(id)
    if (!bank) {
      throw new EntityNotFoundInDatabase(400, 'Bank not found using id')
    }
    return bank
  }

  const retriveAllUserBanks = async (userId) => {
    const bank = await bankRepository.findByUserId(userId)
    return bank
  }

  return Object.freeze({
    createBank,
    retriveBankById,
    createMultipleBank,
    retriveAllUserBanks
  })
}
