import Sequelize from 'sequelize'
const sequelize = new Sequelize('user-management', 'root', '')
sequelize.sync()

export const Account = sequelize.define('account', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  secretPhrase: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})
