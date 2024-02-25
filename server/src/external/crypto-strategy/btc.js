import * as bitcoin from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'
import { RegtestUtils } from 'regtest-client'
import config from '../../configs/index.js'
import math from '../math.js'
import { GetBlockChainTransactionError, CryptoSendTransactionError } from '../../errors/crypto.error.js'

const ECPair = ECPairFactory(ecc)
const regtestUtils = new RegtestUtils(bitcoin, { APIURL: config.REGTEST_API_URL, APIPASS: config.REGTEST_API_PASS })

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
    const hotWallet = bitcoin.payments.p2pkh({ pubkey: hotKeyPair.publicKey })

    const amountInSatoshi = toSatoshi(amount)
    const feeInSatoshi = 1000
    const amountPlusFeeInSatoshi = math.add(amountInSatoshi, feeInSatoshi)

    const psbt = new bitcoin.Psbt({ network })

    try {
      const unspent = await regtestUtils.faucet(hotWallet.address, amountPlusFeeInSatoshi)
      await regtestUtils.mine(8)

      const utx = await regtestUtils.fetch(unspent.txId)

      psbt.addInput({
        hash: unspent.txId,
        index: unspent.vout,
        nonWitnessUtxo: Buffer.from(utx.txHex, 'hex')
      })

      psbt.addOutput({
        address,
        value: amountInSatoshi
      })

      psbt.signInput(0, hotKeyPair)
      psbt.finalizeInput(0)

      const tx = psbt.extractTransaction()

      await regtestUtils.broadcast(tx.toHex())
      await regtestUtils.mine(8)

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

  const toSatoshi = amount => math.multiply(amount, 100000000)
  const fromSatoshi = amount => math.divide(amount, 100000000)

  return { generateAddress, transfer, getTransactionByHash }
}
