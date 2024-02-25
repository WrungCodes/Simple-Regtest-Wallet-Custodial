import BTC from './btc.js'

const implmentations = {
  btc: BTC()
}

export default function cryptoImplementationStrategy () {
  const strategy = (asset) => {
    const implmentation = implmentations[asset.toLowerCase()]

    if (!implmentation) {
      throw new Error('Asset Not Implemented')
    }

    return {
      generateAddress: implmentation.generateAddress,
      getTransactionByHash: implmentation.getTransactionByHash,
      transfer: implmentation.transfer
    }
  }

  return strategy
}
