const database = require('../tools/connectDb')
const OSModel = require('../models/os')
const log = require('../tools/log')
const response = require('../tools/response')
const query = require('../tools/queries')
const os_integrator = require('../tools/verificar_OS_Integrator')


class OS {

  async listar(req, res) {
    log('GET ControllerOS|Listar', 'info')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await OSModel.findAll({order: [['updatedAt', 'DESC']]}).then((res) => {
      isSucess = true
      retorno.msg = "Sucesso ao listar Ordens de Serviços."
      retorno.dados = res
      log(`Listando ${res.length} Ordens de Serviços.`, 'alerta')
    }).catch((err) => {
      retorno.msg = "Erro ao listar Ordens de Serviços"
      retorno.dados = err
      codStatus = 500
      log("ERROR - ControllerOS|Listar.findAll", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async os_vei(req, res) {
    log('GET ControllerOS|OS_veiculo', 'info')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await database.local.query(query.os_por_veiculo).then((res) => {
      isSucess = true
      retorno.msg = "Sucesso ao listar Ordens de Serviços/Veículo."
      retorno.dados = res[0]
      log(`Listando ${res[0].length} Ordens de Serviços/Veículo.`, 'alerta')
    }).catch((err) => {
      retorno.msg = "Erro ao listar Ordens de Serviços/Veículo"
      retorno.dados = err
      codStatus = 500
      log("ERROR - ControllerOS|Listar.findAllJoin", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    await os_integrator()
    .then((res)=>{
      retorno.integrator = res
    })
    .catch((err)=>{
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async exibir(req, res) {
    log('GET ControllerOS|Exibir', 'info')
    log(`Exibindo Ordem de Serviço ID: ${req.params.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await OSModel.findByPk(req.params.id).then((res) => {
      if (res === null) {
        retorno.msg = "Ordem de Serviço não encontrada!"
        retorno.dados = []
        codStatus = 404
      } else {
        retorno.msg = "Sucesso ao exibir a Ordem de Serviço!"
        retorno.dados = res
        isSucess = true
      }
    }).catch((err) => {
      retorno.msg = "Erro ao buscar ID para exibir Ordem de Serviço"
      retorno.dados = err
      codStatus = 500
      log("ERROR - ControllerOS|Exibir.findByPk", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async inserir(req, res) {
    log('POST ControllerOS|Inserir', 'info')
    log(`id_veiculo: ${req.body.id_veiculo} | Ordem de Serviço: ${req.body.ordem_servico}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    const payload = {
      id_veiculo: req.body.id_veiculo,
      ordem_servico: req.body.ordem_servico
    }

    await OSModel.create(payload).then((res) => {
      isSucess = true
      retorno.msg = "Ordem de Serviço cadastrada com sucesso!"
      retorno.dados = res
    }).catch((err) => {
      retorno.msg = "Erro ao cadastrar Ordem de Serviço"
      retorno.dados = err
      codStatus = 500
      log("ERROR - ControllerOS|Inserir.create", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async atualizar(req, res) {
    log('PUT ControllerOS|Atualizar', 'info')
    log(`Editando Ordem de Serviço ID: ${req.body.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200
    let osChange

    await OSModel.findByPk(req.body.id).then((res) => {
      if (res === null) {
        retorno.msg = "Ordem de Serviço não encontrada!"
        codStatus = 404
      } else {
        isSucess = true
        osChange = res
      }
    }).catch((err) => {
      retorno.msg = "Erro ao buscar ID para atualizar Ordem de Serviço"
      retorno.dados = err
      codStatus = 500
      log("ERROR - ControllerOS|Atualizar.findByPk", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    if (isSucess) {
      osChange.id_veiculo = req.body.id_veiculo
      osChange.ordem_servico = req.body.ordem_servico

      await osChange.save().then((res) => {
        retorno.msg = "Sucesso ao atualizar a Ordem de Serviço"
        retorno.dados = res
      }).catch((err) => {
        retorno.msg = "ERRO ao atualizar a Ordem de Serviço"
        retorno.dados = err
        isSucess = false
        codStatus = 500
        log("ERROR - ControllerOS|Atualizar.save", "erro")
        console.error(err)
      })
    }

    response(retorno, res, codStatus, isSucess)
  }

  async deletar(req, res){
    log('DELETE ControllerOS|Deletar', 'info')
    log(`Deletando Ordem de Serviço ID: ${req.params.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await OSModel.destroy({ where: { id: req.params.id } }).then((res) => {
        if (res === 0) {
            retorno.msg = "Erro ao apagar. Ordem de Serviço não foi encontrada"
            retorno.dados = res
            codStatus = 404
        } else {
            retorno.msg = "Sucesso ao deletar a Ordem de Serviço"
            retorno.dados = res
            isSucess = true
        }
    })
    .catch((err) => {
        retorno.msg = "ERRO ao deletar a Ordem de Serviço"
        retorno.dados = err
        codStatus = 500
        log("ERROR - ControllerOS|deletar.destroy", "erro")
        console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

}
module.exports = new OS()