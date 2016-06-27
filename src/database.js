import Sequelize from 'sequelize'
const db = {
  host: process.env.DB_HOST || '127.0.0.1',
  name: process.env.DB_NAME || 'user-management',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
}
const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host
})
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
  },
  accountRS: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
