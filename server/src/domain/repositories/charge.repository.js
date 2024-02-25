export default function chargeRepository (dbRepository) {
  const findByUserId = async (userId) => dbRepository.findBy('userId', userId)
  const findById = async (id) => dbRepository.findById(id)
  const add = async (charge) => dbRepository.insert(charge)

  return Object.freeze({
    findByUserId,
    findById,
    add
  })
}
