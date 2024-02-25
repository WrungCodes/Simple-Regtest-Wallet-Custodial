import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Address = sequelize.define('Address', {
  walletId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  privateKey: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

export const address = {
  findById: async (id) => await Address.findByPk(id, { raw: true }),
  insert: async (address) => (await Address.create(address)).get({ plain: true }),
  findBy: async (propertyName, value) => await Address.findOne({ raw: true, where: { [propertyName]: value } }),
  findManyBy: async (propertyName, value) => await Address.findAll({ raw: true, where: { [propertyName]: value } })
}
