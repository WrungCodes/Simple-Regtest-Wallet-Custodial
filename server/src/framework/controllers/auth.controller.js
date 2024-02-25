import User from '../../domain/entities/user.js'
import signIn from '../../domain/usecases/signin.js'
import signUp from '../../domain/usecases/signup.js'

export default function authController (userService, passwordImpl, jwtCookieImpl) {
  const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    const signInUsecase = signIn(userService, passwordImpl)
    const loggedInUser = await signInUsecase.execute(User(null, email, password))
    res.cookie(...jwtCookieImpl.addCookieBodyParameter(loggedInUser)).send(loggedInUser)
  }

  const signupUser = async (req, res, next) => {
    const { name, email, password } = req.body

    const signUpUsecase = signUp(userService, passwordImpl)
    const signedUpUser = await signUpUsecase.execute(User(name, email, password))
    res.cookie(...jwtCookieImpl.addCookieBodyParameter(signedUpUser)).send(signedUpUser)
  }

  const logout = async (req, res, next) => {
    res
      .clearCookie(jwtCookieImpl.getCookieTag())
      .send()
  }

  const currentUser = async (req, res, next) => {
    res.send({
      message: 'welcome to the protected route!',
      user: res.locals.user
    })
  }

  return {
    logout,
    loginUser,
    signupUser,
    currentUser
  }
}
