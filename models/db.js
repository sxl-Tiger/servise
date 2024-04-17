const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('monitor', 'root', '19980518', {
  host: 'localhost',
  dialect:'mysql',
  logging:false
})

module.exports = sequelize