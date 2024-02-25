import events from 'events'
import { databaseSelector } from '../database/index.js'
import walletService from '../domain/services/wallet.service.js'
import addressService from '../domain/services/address.service.js'
import walletRepository from '../domain/repositories/wallet.repository.js'
import addressRepository from '../domain/repositories/address.repository.js'
import cryptoStrategyImplementation from '../external/crypto-strategy/index.js'
import creditAndCreateWalletTransaction from '../domain/usecases/creditAndCreateWalletTransaction.js'

const cryptoSendEvent = new events.EventEmitter()

const database = databaseSelector()
const dbRepository = database.repository()

const walletRepositoryImpl = walletRepository(dbRepository.wallet)
const walletServiceImpl = walletService(walletRepositoryImpl)

const addressRepositoryImpl = addressRepository(dbRepository.address)
const addressServiceImpl = addressService(addressRepositoryImpl)

const cryptoStrategyImplem = cryptoStrategyImplementation()

const creditAndCreateWalletTransactionUseCase = creditAndCreateWalletTransaction(
  walletServiceImpl,
  addressServiceImpl,
  cryptoStrategyImplem
)

cryptoSendEvent.on('send', ({ symbol, hash, address }) => {
  creditAndCreateWalletTransactionUseCase.execute(symbol, hash, address)
})

export default cryptoSendEvent
