const Sequelize = require('sequelize')

module.exports = bd = {
    local: new Sequelize(
        process.env.DB_NAME, 
        process.env.DB_USER, 
        process.env.DB_PASS, 
        {
            dialect: 'mysql',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            logging: false
        }
    ),
    integrator: new Sequelize(
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
}