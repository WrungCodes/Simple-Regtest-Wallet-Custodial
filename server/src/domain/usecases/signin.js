import { EntityNotFoundInDatabase } from '../../errors/database.errors.js'
import { InvalidLoginCredentialError } from '../../errors/user.errors.js'

export default function signIn (userService, passwordImpl) {
  const execute = async (suppliedUser) => {
    await throwErrorIfEmailDoesNotExist(suppliedUser.email)
    const retrivedUser = await throwOrReturnUserUsingSuppliedUser(suppliedUser)
    await compareProvidedPasswordWithUserPasswordGottenByEmail(retrivedUser, suppliedUser)
    return formatAndReturnUser(retrivedUser)
  }

  const throwErrorIfEmailDoesNotExist = async (email) => {
    const emailExist = await checkIfEmailExists(email)
    if (!emailExist) {
      throwLoginFailedDueToInvalidCredentials()
    }
  }

  const checkIfEmailExists = async (email) => await userService.doesTheEmailExist(email)

  const throwOrReturnUserUsingSuppliedUser = async (suppliedUser) => {
    try {
      const user = await userService.retriveUserByEmail(suppliedUser.email)
      return user
    } catch (error) {
      if (error instanceof EntityNotFoundInDatabase) {
        throwLoginFailedDueToInvalidCredentials()
      }
      throw error
    }
  }

  const compareProvidedPasswordWithUserPasswordGottenByEmail = async (retrivedUser, suppliedUser) => {
    const isPasswordCorrect = await passwordImpl.compare(retrivedUser.password, suppliedUser.password)
    if (!isPasswordCorrect) {
      throwLoginFailedDueToInvalidCredentials()
    }
  }

  const throwLoginFailedDueToInvalidCredentials = () => {
    throw new InvalidLoginCredentialError(400, 'Unable to login User due to invalid credentials')
  }

  const formatAndReturnUser = (user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }

  return { execute }
}
