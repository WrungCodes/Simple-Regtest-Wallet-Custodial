import mainController from '../controllers/main.controller.js'
import { databaseSelector } from '../../database/index.js'
import walletService from '../../domain/services/wallet.service.js'
import assetService from '../../domain/services/asset.service.js'
import addressService from '../../domain/services/address.service.js'
import walletRepository from '../../domain/repositories/wallet.repository.js'
import addressRepository from '../../domain/repositories/address.repository.js'
import assetRepository from '../../domain/repositories/asset.repository.js'
import bankService from '../../domain/services/bank.service.js'
import bankRepository from '../../domain/repositories/bank.repository.js'
import asyncHandler from 'express-async-handler'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import encryptionImplementation from '../../external/encryption.js'
import cryptoStrategyImplementation from '../../external/crypto-strategy/index.js'
import config from '../../configs/index.js'
import plaidImplementation from '../../external/plaid.js'

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
const plaidImplem = plaidImplementation()

const encryptionImplem = encryptionImplementation(config.ENCRYPTION_KEY, config.ENCRYPTION_IV, config.ENCRYPTION_METHOD)
const cryptoStrategyImplem = cryptoStrategyImplementation()

export default function mainRouter (express) {
  const router = express.Router()

  const controller = mainController(assetServiceImpl, walletServiceImpl, addressServiceImpl, bankServiceImpl, cryptoStrategyImplem, encryptionImplem, plaidImplem)

  router.route('/').get(authMiddleware, asyncHandler(controller.loadUserData))
  return router
}
