import { EntityInsertionIntoDatabaseFailed, EntityUpdatingDatabaseFailed } from '../../errors/database.errors.js'

export default function transferService (transferRepository) {
  const createTransfer = async (transfer) => {
    try {
      const insertedTransfer = await transferRepository.add(transfer)
      return insertedTransfer
    } catch (error) {
      throw new EntityInsertionIntoDatabaseFailed(500, 'Unable to insert Transfer into database')
    }
  }

  const updateTransfer = async (transfer) => {
    try {
      await transferRepository.update(transfer)
    } catch (error) {
      throw new EntityUpdatingDatabaseFailed(500, 'Unable to update Transfer into database')
    }
  }

  return Object.freeze({
    createTransfer,
    updateTransfer
  })
}
