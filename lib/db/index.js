const { Sequelize, Model, DataTypes } = require('sequelize')

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB } = process.env

if (DB) {
  console.log('connecting to', {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB,
  })
}
const sequelize = DB
  ? new Sequelize({
      database: DB,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'postgres',
      // dialectOptions: {
      //   ssl: {
      //     require: true,
      //     rejectUnauthorized: false,
      //   },
      // },
    })
  : new Sequelize('sqlite::memory')

class Packet extends Model {}
Packet.init(
  {
    session_id: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
    host: DataTypes.STRING,
    ip: DataTypes.STRING,
    protocol: DataTypes.STRING,
    method: DataTypes.STRING,
    accept: DataTypes.STRING,
    location: DataTypes.GEOMETRY('POINT'),
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    timezone: DataTypes.STRING,
  },
  { sequelize, modelName: 'packet' }
)

class Session extends Model {}
Session.init(
  {
    start: DataTypes.DATE,
    end: DataTypes.DATE,
  },
  { sequelize, modelName: 'session' }
)

sequelize.sync()

module.exports = {
  Packet,
  Session,
}
