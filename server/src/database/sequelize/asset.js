import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Asset = sequelize.define('Asset', {
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  decimal: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export const asset = {
  findById: async (id) => await Asset.findByPk(id, { raw: true }),
  insert: async (asset) => (await Asset.create(asset)).get({ plain: true }),
  findBy: async (propertyName, value) => await Asset.findOne({ raw: true, where: { [propertyName]: value } }),
  findManyBy: async (propertyName, value) => await Asset.findAll({ raw: true, where: { [propertyName]: value } })
}

export const seed = async () => {
  const asset = await Asset.findOne({ raw: true, where: { symbol: 'BTC' } })
  if (!asset) {
    await Asset.create({
      currency: 'Bitcoin',
      symbol: 'BTC',
      decimal: 8,
      type: 'crypto'
    })
  }
}
