import bankController from '../controllers/bank.controller.js'
import { validationErrorsMiddleware } from '../middlewares/validation.result.middleware.js'
import { completeBankLinkValidator } from '../validators/bank.validators.js'
import { databaseSelector } from '../../database/index.js'
import bankService from '../../domain/services/bank.service.js'
import bankRepository from '../../domain/repositories/bank.repository.js'
import asyncHandler from 'express-async-handler'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import plaidImplementation from '../../external/plaid.js'

const database = databaseSelector()
const bankRepositoryImpl = bankRepository(database.repository().bank)
const bankServiceImpl = bankService(bankRepositoryImpl)
const plaidImplem = plaidImplementation()

export default function bankRouter (express) {
  const router = express.Router()

  const controller = bankController(bankServiceImpl, plaidImplem)

  router.route('/link/begin').get(authMiddleware, asyncHandler(controller.startBanklink))
  router.route('/link/confirm').post(authMiddleware, completeBankLinkValidator, validationErrorsMiddleware, asyncHandler(controller.completeBanklink))

  return router
}
