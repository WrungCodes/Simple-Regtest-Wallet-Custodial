export default function userRepository (dbRepository) {
  const findByEmail = async (email) => dbRepository.findBy('email', email)
  const findById = async (id) => dbRepository.findById(id)
  const add = async (user) => dbRepository.insert(user)

  return Object.freeze({
    findByEmail,
    findById,
    add
  })
}
