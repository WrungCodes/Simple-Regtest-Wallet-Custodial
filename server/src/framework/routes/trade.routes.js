import tradeController from '../controllers/trade.controller.js'
import { databaseSelector } from '../../database/index.js'
import { validationErrorsMiddleware } from '../middlewares/validation.result.middleware.js'
import { tradeValidator } from '../validators/trade.validators.js'
import walletService from '../../domain/services/wallet.service.js'
import assetService from '../../domain/services/asset.service.js'
import addressService from '../../domain/services/address.service.js'
import bankService from '../../domain/services/bank.service.js'
import transferService from '../../domain/services/transfer.service.js'
import chargeService from '../../domain/services/charge.service.js'
import walletRepository from '../../domain/repositories/wallet.repository.js'
import addressRepository from '../../domain/repositories/address.repository.js'
import assetRepository from '../../domain/repositories/asset.repository.js'
import bankRepository from '../../domain/repositories/bank.repository.js'
import transferRepository from '../../domain/repositories/transfer.repository.js'
import chargeRepository from '../../domain/repositories/charge.repository.js'
import asyncHandler from 'express-async-handler'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import encryptionImplementation from '../../external/encryption.js'
import rateImplementationStrategy from '../../external/rate.js'
import cryptoStrategyImplementation from '../../external/crypto-strategy/index.js'
import plaidImplementation from '../../external/plaid.js'
import config from '../../configs/index.js'

const database = databaseSelector()
const dbRepository = database.repository()

const assetRepositoryImpl = assetRepository(dbRepository.asset)
const assetServiceImpl = assetService(assetRepositoryImpl)

const walletRepositoryImpl = walletRepository(dbRepository.wallet)
const walletServiceImpl = walletService(walletRepositoryImpl)

const addressRepositoryImpl = addressRepository(dbRepository.address)
const addressServiceImpl = addressService(addressRepositoryImpl)

const bankRepositoryImpl = bankRepository(database.repository().bank)
const bankServiceImpl = bankService(bankRepositoryImpl)

const transferRepositoryImpl = transferRepository(dbRepository.transfer)
const transferServiceImpl = transferService(transferRepositoryImpl)

const chargeRepositoryImpl = chargeRepository(dbRepository.charge)
const chargeServiceImpl = chargeService(chargeRepositoryImpl)

const plaidImplem = plaidImplementation()

const encryptionImplem = encryptionImplementation(config.ENCRYPTION_KEY, config.ENCRYPTION_IV, config.ENCRYPTION_METHOD)
const cryptoStrategyImplem = cryptoStrategyImplementation()

const rateImpl = rateImplementationStrategy()

export default function tradeRouter (express) {
  const router = express.Router()

  const controller = tradeController(
    assetServiceImpl,
    walletServiceImpl,
    addressServiceImpl,
    bankServiceImpl,
    chargeServiceImpl,
    transferServiceImpl,
    cryptoStrategyImplem,
    encryptionImplem,
    plaidImplem,
    rateImpl
  )

  router.route('/').post(authMiddleware, tradeValidator, validationErrorsMiddleware, asyncHandler(controller.processTrade))

  return router
}
