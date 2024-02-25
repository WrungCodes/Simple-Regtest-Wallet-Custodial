import authController from '../controllers/auth.controller.js'
import { validationErrorsMiddleware } from '../middlewares/validation.result.middleware.js'
import { loginValidator, signupValidator } from '../validators/auth.validators.js'
import { databaseSelector } from '../../database/index.js'
import userService from '../../domain/services/user.service.js'
import userRepository from '../../domain/repositories/user.repository.js'
import asyncHandler from 'express-async-handler'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import passwordImplementation from '../../external/password.js'
import jwtCookieImplementation from '../../external/jwt.js'

export default function authRouter (express) {
  const database = databaseSelector()
  const userRepositoryImpl = userRepository(database.repository().user)
  const userServiceImpl = userService(userRepositoryImpl)
  const passwordImpl = passwordImplementation()
  const jwtCookieImpl = jwtCookieImplementation()

  const router = express.Router()

  const controller = authController(userServiceImpl, passwordImpl, jwtCookieImpl)

  router.route('/signin').post(loginValidator, validationErrorsMiddleware, asyncHandler(controller.loginUser))
  router.route('/signup').post(signupValidator, validationErrorsMiddleware, asyncHandler(controller.signupUser))
  router.route('/user').get(authMiddleware, asyncHandler(controller.currentUser))
  router.route('/logout').post(authMiddleware, asyncHandler(controller.logout))

  return router
}
