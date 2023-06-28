const RevisoesModel = require('../models/revisoes')
const log = require('../tools/log')
const response = require('../tools/response')


class Revisao {

  async listar(req, res) {
    log('GET Controller|Revisões|Listar', 'info')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await RevisoesModel.findAll({order: [['updatedAt', 'DESC']]}).then((res) => {
      isSucess = true
      retorno.msg = "Sucesso ao listar Revisões."
      retorno.dados = res
      log(`Listando ${res.length} Revisões.`, 'alerta')
    }).catch((err) => {
      retorno.msg = "Erro ao listar Revisões"
      retorno.dados = err
      codStatus = 500
      log("ERROR - Controller|Revisões|Listar.findAll", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async exibir(req, res) {
    log('GET Controller|Revisões|Exibir', 'info')
    log(`Exibindo Revisão ID: ${req.params.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await RevisoesModel.findByPk(req.params.id).then((res) => {
      if (res === null) {
        retorno.msg = "Revisão não encontrada!"
        retorno.dados = []
        codStatus = 404
      } else {
        retorno.msg = "Sucesso ao exibir a Revisão!"
        retorno.dados = res
        isSucess = true
      }
    }).catch((err) => {
      retorno.msg = "Erro ao buscar ID para exibir Revisão"
      retorno.dados = err
      codStatus = 500
      log("ERROR - Controller|Revisões|Exibir.findByPk", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async inserir(req, res) {
    log('POST Controller|Revisões|Inserir', 'info')
    log(`id_veiculo: ${req.body.id_veiculo} | Valor: ${req.body.valor}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    const payload = {
      id_veiculo: req.body.id_veiculo,
      valor: req.body.valor,
      km_revisa_feita: req.body.km_revisa_feita,
      obs: req.body.obs
    }

    await RevisoesModel.create(payload).then((res) => {
      isSucess = true
      retorno.msg = "Revisão cadastrada com sucesso!"
      retorno.dados = res
    }).catch((err) => {
      retorno.msg = "Erro ao cadastrar Revisão"
      retorno.dados = err
      codStatus = 500
      log("ERROR - Controller|Revisões|Inserir.create", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async atualizar(req, res) {
    log('PUT Controller|Revisões|Atualizar', 'info')
    log(`Editando Revisão ID: ${req.body.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200
    let RevisaoChange

    await RevisoesModel.findByPk(req.body.id).then((res) => {
      if (res === null) {
        retorno.msg = "Revisão não encontrada!"
        codStatus = 404
      } else {
        isSucess = true
        RevisaoChange = res
      }
    }).catch((err) => {
      retorno.msg = "Erro ao buscar ID para atualizar Revisão"
      retorno.dados = err
      codStatus = 500
      log("ERROR - Controller|Revisões|Atualizar.findByPk", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    if (isSucess) {
      RevisaoChange.id_veiculo = req.body.id_veiculo
      RevisaoChange.valor = req.body.valor
      RevisaoChange.km_revisa_feita = req.body.km_revisa_feita
      RevisaoChange.obs = req.body.obs

      await RevisaoChange.save().then((res) => {
          retorno.dados = res
          retorno.msg = "Sucesso ao atualizar a Revisão"
        }).catch((err) => {
          retorno.msg = "ERRO ao atualizar a Revisão"
          retorno.dados = err
          isSucess = false
          codStatus = 500
          log("ERROR - Controller|Revisões|Atualizar.save", "erro")
          console.error(err)
        })
    }

    response(retorno, res, codStatus, isSucess)
  }

  async deletar(req, res){
    log('DELETE Controller|Revisões|Deletar', 'info')
    log(`Deletando Revisão ID: ${req.params.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await RevisoesModel.destroy({ where: { id: req.params.id } }).then((res) => {
        if (res === 0) {
            retorno.msg = "Erro ao apagar. Revisão não foi encontrada"
            retorno.dados = res
            codStatus = 404
        } else {
            retorno.msg = "Sucesso ao deletar a Revisão"
            retorno.dados = res
            isSucess = true
        }
    })
    .catch((err) => {
        retorno.msg = "ERRO ao deletar a Revisão"
        retorno.dados = err
        codStatus = 500
        log("ERROR - Controller|Revisões|deletar.destroy", "erro")
        console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

}
module.exports = new Revisao()