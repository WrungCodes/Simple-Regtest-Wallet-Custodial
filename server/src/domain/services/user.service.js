import { EntityNotFoundInDatabase, EntityInsertionIntoDatabaseFailed } from '../../errors/database.errors.js'

export default function userService (userRepository) {
  const createUser = async (user) => {
    try {
      const insertedUser = await userRepository.add(user)
      return insertedUser
    } catch (error) {
      throw new EntityInsertionIntoDatabaseFailed(500, 'Unable to insert User into database')
    }
  }

  const doesTheEmailExist = async (email) => {
    return (await userRepository.findByEmail(email)) != null
  }

  const retriveUserByEmail = async (email) => {
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new EntityNotFoundInDatabase(400, 'User not found using email')
    }
    return user
  }

  return Object.freeze({
    createUser,
    doesTheEmailExist,
    retriveUserByEmail
  })
}
