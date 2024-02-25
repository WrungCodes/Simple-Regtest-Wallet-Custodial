import { DuplicateEmailError } from '../../errors/user.errors.js'

export default function signUp (userService, passwordImpl) {
  const execute = async (user) => {
    await throwErrorIfEmailAlreadyExists(user.email)
    return await formatCreateAndReturnUser(user)
  }

  const throwErrorIfEmailAlreadyExists = async (email) => {
    const emailExist = await checkIfEmailExists(email)
    if (emailExist) {
      throwUserCreationFailedDueToDuplicateMail()
    }
  }

  const checkIfEmailExists = async (email) => await userService.doesTheEmailExist(email)

  const throwUserCreationFailedDueToDuplicateMail = () => {
    throw new DuplicateEmailError(400, 'Unable to create User due to duplicate mail', '')
  }

  const formatCreateAndReturnUser = async (user) => {
    const formattedUser = await formatUserBeforeInsert(user)
    const createdUser = await userService.createUser(formattedUser)
    return formatUserAfterInsert(createdUser)
  }

  const formatUserBeforeInsert = async (user) => {
    const hashedPassword = await passwordImpl.toHash(user.password)

    return {
      name: user.name,
      email: user.email,
      password: hashedPassword
    }
  }

  const formatUserAfterInsert = async (user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }

  return { execute }
}
