const Sequelize = require('sequelize')
const bd = require('../tools/connectDb')

const Veiculo = bd.local.define('veiculo', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  modelo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  placa: {
    type: Sequelize.STRING,
    allowNull: false
  },
  motorista: {
    type: Sequelize.STRING,
    allowNull: true
  },
  cod_os: {
    type: Sequelize.STRING,
    allowNull: true
  },
  numero: {
    type: Sequelize.STRING,
    allowNull: true
  },
  km_atual: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  km_revisao: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  ativo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  obs: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

module.exports = Veiculo