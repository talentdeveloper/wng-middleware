import Sequelize from 'sequelize'
const db = {
  name: process.env.DB_NAME || 'user-management',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
}

const settings = {
  host: process.env.DB_HOST || '127.0.0.1'
}

if (process.env.NODE_ENV === 'development') {
  settings.dialect = 'sqlite'
  settings.storage = './database.sqlite'
}

const sequelize = new Sequelize(db.name, db.user, db.password, settings)
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

export const AccountVerificationApplication =
  sequelize.define('account_verification_application', {
    accountRS: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    full_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    comments: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true
    },
    files: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  })
