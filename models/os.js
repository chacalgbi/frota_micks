const Sequelize = require('sequelize')
const bd = require('../tools/connectDb')

const OS = bd.local.define('os', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  id_veiculo: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ordem_servico: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = OS