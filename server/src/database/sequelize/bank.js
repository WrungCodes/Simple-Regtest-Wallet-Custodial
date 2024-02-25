import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Bank = sequelize.define('Bank', {
  service: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export const bank = {
  findById: async (id) => await Bank.findByPk(id, { raw: true }),
  insert: async (bank) => (await Bank.create(bank)).get({ plain: true }),
  findBy: async (propertyName, value) => await Bank.findOne({ raw: true, where: { [propertyName]: value } }),
  findManyBy: async (propertyName, value) => await Bank.findAll({ raw: true, where: { [propertyName]: value } })
}
