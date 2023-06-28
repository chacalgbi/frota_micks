const log = require('../tools/log')
const response = require('../tools/response')
const login = require('../tools/loginIntegrator')


class Diversos {

  async login(req, res) {
    log('POST Controller|Diversos|Login', 'info')
    log(`Usuário: ${req.body.user}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await login(req.body.user, req.body.pass).then((res)=>{
      isSucess = true
      retorno.msg = `${res.nome_usu} logado com sucesso!`
      retorno.token = res.token
    }).catch((err)=>{
      codStatus = err.response.status
      retorno.msg = `${req.body.user}: ${err.response.data.message}!`
    })

    response(retorno, res, codStatus, isSucess)
  }

}
module.exports = new Diversos()