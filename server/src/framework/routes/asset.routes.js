import assetController from '../controllers/asset.controller.js'
import { databaseSelector } from '../../database/index.js'
import walletService from '../../domain/services/wallet.service.js'
import assetService from '../../domain/services/asset.service.js'
import addressService from '../../domain/services/address.service.js'
import walletRepository from '../../domain/repositories/wallet.repository.js'
import addressRepository from '../../domain/repositories/address.repository.js'
import assetRepository from '../../domain/repositories/asset.repository.js'
import asyncHandler from 'express-async-handler'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import encryptionImplementation from '../../external/encryption.js'
import rateImplementationStrategy from '../../external/rate.js'
import cryptoStrategyImplementation from '../../external/crypto-strategy/index.js'
import config from '../../configs/index.js'

const database = databaseSelector()
const dbRepository = database.repository()

const assetRepositoryImpl = assetRepository(dbRepository.asset)
const assetServiceImpl = assetService(assetRepositoryImpl)

const walletRepositoryImpl = walletRepository(dbRepository.wallet)
const walletServiceImpl = walletService(walletRepositoryImpl)

const addressRepositoryImpl = addressRepository(dbRepository.address)
const addressServiceImpl = addressService(addressRepositoryImpl)

const encryptionImplem = encryptionImplementation(config.ENCRYPTION_KEY, config.ENCRYPTION_IV, config.ENCRYPTION_METHOD)
const cryptoStrategyImplem = cryptoStrategyImplementation()

const rateImpl = rateImplementationStrategy()

export default function assetRouter (express) {
  const router = express.Router()

  const controller = assetController(assetServiceImpl, walletServiceImpl, addressServiceImpl, cryptoStrategyImplem, encryptionImplem, rateImpl)

  router.route('/').get(asyncHandler(controller.getAssets))
  router.route('/:id/rate').get(asyncHandler(controller.getAssetRate))
  router.route('/:id/wallet').get(authMiddleware, asyncHandler(controller.getUserWalletAndAddress))

  return router
}
