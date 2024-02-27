export default function bankRepository (dbRepository) {
  const findByUserId = async (userId) => dbRepository.findManyBy('userId', userId)
  const addMultiple = async (banks) => dbRepository.insertMany(banks)
  const findById = async (id) => dbRepository.findById(id)
  const add = async (bank) => dbRepository.insert(bank)

  return Object.freeze({
    findByUserId,
    addMultiple,
    findById,
    add
  })
}
