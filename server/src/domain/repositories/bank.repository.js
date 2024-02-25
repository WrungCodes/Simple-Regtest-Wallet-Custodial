export default function bankRepository (dbRepository) {
  const findByUserId = async (userId) => dbRepository.findManyBy('userId', userId)
  const findById = async (id) => dbRepository.findById(id)
  const add = async (bank) => dbRepository.insert(bank)

  return Object.freeze({
    findByUserId,
    findById,
    add
  })
}
