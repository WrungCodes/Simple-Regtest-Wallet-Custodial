import * as bitcoin from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'
import { RegtestUtils } from 'regtest-client'
import config from '../../configs/index.js'
import math from '../math.js'
import { GetBlockChainTransactionError, CryptoSendTransactionError } from '../../errors/crypto.error.js'

const DEFAULT_FEE_IN_SATOSHI = 1000
const STANDARD_BLOCK_CONFIRMATION = 10

const ECPair = ECPairFactory(ecc)
const regtestUtils = new RegtestUtils({ APIURL: config.REGTEST_API_URL, APIPASS: config.REGTEST_API_PASS })

export default function BTC () {
  const generateAddress = () => {
    const keyPair = ECPair.makeRandom()
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.regtest })
    return { address, privateKey: keyPair.toWIF() }
  }

  const transfer = async (address, amount) => {
    const network = regtestUtils.network

    const hotKeyPair = ECPair.fromWIF(
      config.BITCOIN_HOTWALLET_PRIVATE_KEY
    )
    const hotWallet = bitcoin.payments.p2pkh({ pubkey: hotKeyPair.publicKey, network: bitcoin.networks.regtest })

    const amountInSatoshi = toSatoshi(amount)
    const amountPlusFeeInSatoshi = math.add(amountInSatoshi, DEFAULT_FEE_IN_SATOSHI)

    const psbt = new bitcoin.Psbt({ network })

    try {
      const unspent = await regtestUtils.faucet(hotWallet.address, amountPlusFeeInSatoshi)
      await regtestUtils.mine(STANDARD_BLOCK_CONFIRMATION)

      const utx = await regtestUtils.fetch(unspent.txId)

      psbt.addInput({
        hash: unspent.txId,
        index: unspent.vout,
        nonWitnessUtxo: Buffer.from(utx.txHex, 'hex')
      })

      psbt.addOutput({
        address,
        value: Number(amountInSatoshi)
      })

      psbt.signInput(0, hotKeyPair)
      psbt.finalizeInput(0)

      const tx = psbt.extractTransaction()

      await regtestUtils.broadcast(tx.toHex())
      await regtestUtils.mine(STANDARD_BLOCK_CONFIRMATION)

      const txid = tx.getId()

      return { hash: txid }
    } catch (error) {
      throw new CryptoSendTransactionError(500, error.message)
    }
  }

  const getTransactionByHash = async (txid) => {
    try {
      const transactions = []
      const blockchainTransaction = await regtestUtils.fetch(txid)

      blockchainTransaction.outs.forEach((output, index) => {
        transactions.push({
          hash: blockchainTransaction.txId,
          address: output.address,
          value: fromSatoshi(output.value),
          vout: index
        })
      })
      return transactions
    } catch (error) {
      if (error.message === 'Bad Request') {
        throw new GetBlockChainTransactionError(400, 'Invalid transaction hash')
      }
      throw error
    }
  }

  const toSatoshi = amount => math.fixedDecimalPlace(math.multiply(amount, 100000000))
  const fromSatoshi = amount => math.divide(amount, 100000000)

  return { generateAddress, transfer, getTransactionByHash }
}
