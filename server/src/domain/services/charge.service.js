import { EntityInsertionIntoDatabaseFailed } from '../../errors/database.errors.js'

export default function chargeService (chargeRepository) {
  const createCharge = async (charge) => {
    try {
      const insertedCharge = await chargeRepository.add(charge)
      return insertedCharge
    } catch (error) {
      throw new EntityInsertionIntoDatabaseFailed(500, 'Unable to insert Charge into database')
    }
  }

  const retriveAllUserCharges = async (userId) => {
    const charge = await chargeRepository.findByUserId(userId)
    return charge
  }

  return Object.freeze({
    createCharge,
    retriveAllUserCharges
  })
}
