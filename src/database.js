import Sequelize from 'sequelize'
const sequelize = new Sequelize('user-management', 'root', '')
sequelize.sync()

export const Account = sequelize.define('account', {
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  secretPhrase: Sequelize.TEXT
})
