const Sequelize = require('sequelize')
const bd = require('../tools/connectDb')

const Revisao = bd.local.define('revisao', {
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
  valor: {
    type: Sequelize.STRING,
    allowNull: false
  },
  km_revisa_feita: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  obs: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

module.exports = Revisao