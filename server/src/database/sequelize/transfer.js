import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Transfer = sequelize.define('Transfer', {
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chargeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rate: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export const transfer = {
  insert: async (transfer) => (await Transfer.create(transfer)).get({ plain: true }),
  update: async (transfer) => await Transfer.update({ status: transfer.status, hash: transfer.hash }, { where: { id: transfer.id } })
}
