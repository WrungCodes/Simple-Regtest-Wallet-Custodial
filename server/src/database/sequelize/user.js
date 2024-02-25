import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

export const user = {
  findById: async (id) => await User.findByPk(id, { raw: true }),
  insert: async (user) => (await User.create(user)).get({ plain: true }),
  findBy: async (propertyName, value) => await User.findOne({ raw: true, where: { [propertyName]: value } })
}
