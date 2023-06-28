const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    process.env.INTEGRATOR_DB_NAME, 
    process.env.INTEGRATOR_DB_USER, 
    process.env.INTEGRATOR_DB_PASS, 
    {
        dialect: 'mysql',
        host: process.env.INTEGRATOR_DB_HOST,
        port: process.env.INTEGRATOR_DB_PORT,
        logging: false
    }
)

module.exports = sequelize