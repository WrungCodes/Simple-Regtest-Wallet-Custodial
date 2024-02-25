import sequelize from './sequelize.js'

import { user } from './user.js'
import { bank } from './bank.js'
import { charge } from './charge.js'
import { asset, seed as assetSeed } from './asset.js'
import { address } from './address.js'
import { wallet } from './wallet.js'
import { transfer } from './transfer.js'

export default function sequelizeDb () {
  async function connect () {
    await sequelize.sync()
  }

  async function setUpMemoryDatabase () {
    await runMigration()
    await runSeeder()
  }

  async function runMigration () { }
  async function runSeeder () {
    await assetSeed()
  }

  function repository () {
    return {
      user,
      bank,
      charge,
      asset,
      address,
      wallet,
      transfer
    }
  }

  return Object.freeze({
    connect,
    setup: async () => { await setUpMemoryDatabase() },
    repository
  })
}
