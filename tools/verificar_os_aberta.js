const query = require('./queries')
const bd = require('./connectDb')
const integrator = require('./verificar_OS_Integrator')
const alertaTelegram = require('./telegram')
const log   = require('./log')

module.exports = async function verificar_os_aberta(){

  let os_sistema = []
  let os_integrator = []

  await bd.local.query(query.ordens_servicos)
    .then((res) => {
      os_sistema = res[0].map(obj => obj.ordem_servico)
    })
    .catch((err) => { 
      console.error('\x1b[41m', err, '\x1b[0m')
    })

  await integrator()
    .then((res)=>{
      os_integrator = res.map(obj => obj.num_os.toString())
    })
    .catch((err)=>{
      console.error('\x1b[41m', err, '\x1b[0m')
    })

  for (const [index, os] of os_integrator.entries()) {
    if (os_sistema.includes(os)) {
      log(`${os} já está no sistema`, 'temp')
    }else{
      await alertaTelegram(`Ordem de Serviço ${os} ainda não foi concluída.`)
        .then((res) => { 
          console.log(`Enviado para ${res.chat.title}`) 
        })
        .catch((err) => {
          console.error('\x1b[41m', err, '\x1b[0m')
        })
    }
  }

}