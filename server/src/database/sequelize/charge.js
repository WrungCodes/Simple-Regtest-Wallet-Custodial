import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Charge = sequelize.define('Charge', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bankId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  }
})

export const charge = {
  findById: async (id) => await Charge.findByPk(id, { raw: true }),
  insert: async (charge) => (await Charge.create(charge)).get({ plain: true }),
  findBy: async (propertyName, value) => await Charge.findOne({ raw: true, where: { [propertyName]: value } }),
  findManyBy: async (propertyName, value) => await Charge.findAll({ raw: true, where: { [propertyName]: value } })
}
