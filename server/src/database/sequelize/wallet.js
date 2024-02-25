import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Wallet = sequelize.define('Wallet', {
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
})

const WalletTransaction = sequelize.define('WalletTransaction', {
  walletId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vout: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
})

export const wallet = {
  findById: async (id) => await Wallet.findByPk(id, { raw: true }),
  insert: async (wallet) => (await Wallet.create(wallet)).get({ plain: true }),
  findBy: async (propertyName, value) => await Wallet.findOne({ raw: true, where: { [propertyName]: value } }),
  findManyBy: async (propertyName, value) => await Wallet.findAll({ raw: true, where: { [propertyName]: value } }),
  findOneByMany: async (arrayOfQueries) => await Wallet.findOne({
    raw: true,
    where: arrayOfQueries.reduce((acc, query) => ({ ...acc, ...query }), {})
  }),
  findManyByMany: async (arrayOfQueries) => await Wallet.findAll({
    raw: true,
    where: arrayOfQueries.reduce((acc, query) => ({ ...acc, ...query }), {})
  }),
  findOneWalletTransactionByMany: async (arrayOfQueries) => await WalletTransaction.findOne({
    raw: true,
    where: arrayOfQueries.reduce((acc, query) => ({ ...acc, ...query }), {})
  }),
  updateWalletBalance: async (wallet, transaction) => {
    let dbTransaction
    try {
      dbTransaction = await sequelize.transaction()
      await Wallet.update(
        { balance: wallet.balance },
        { where: { id: wallet.id } }
      )
      await WalletTransaction.create(transaction)
      await dbTransaction.commit()
      return true
    } catch (err) {
      await dbTransaction.rollback()
      return false
    }
  }
}
