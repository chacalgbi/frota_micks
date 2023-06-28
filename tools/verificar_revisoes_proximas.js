const VeiculosModel = require('../models/veiculos')
const alertaTelegram = require('./telegram')

module.exports = async function verificar_revisoes_proximas(){
  let veiculos = []
  await VeiculosModel.findAll()
    .then((res) => {
      veiculos = res
    }).catch((err) => {
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    for (const [index, veiculo] of veiculos.entries()) {
      let msg = ''
      const km_restante = veiculo.km_revisao - veiculo.km_atual
      
      if(km_restante < 0){
        msg = `ATENÇÃO! O veículo ${veiculo.modelo} - ${veiculo.numero} já passou em ${Math.abs(km_restante)}KM do limite de kilometragem para a revisão!`
      }else if(km_restante < process.env.ALERTA_KM_REVISAO){
        msg = `O veículo ${veiculo.modelo} - ${veiculo.numero} falta ${km_restante}KM para a revisão!`
      }

      if(msg.length > 10){
        await alertaTelegram(msg)
        .then((res) => { 
          console.log(`Enviado para ${res.chat.title}`) 
        })
        .catch((err) => {
          console.error('\x1b[41m', err, '\x1b[0m')
        })
      }
    }
}