const log   = require('./log')
const bd = require('./connectDb')
const query = require('./queries')

module.exports = function verificar_OS_Integrator(){
  log(`Buscando OSs`, 'info')
  return new Promise((resolve, reject) => {
    bd.integrator.query(query.ordens_servicos_integrator).then(function (response) {
      resolve(response[0])
    }).catch(function (error) {
      reject(error)
    })
  })
}