const VeiculosModel = require('../models/veiculos')
const OSModel = require('../models/os')
const log = require('../tools/log')
const response = require('../tools/response')


class Veiculo {

  async listar(req, res) {
    log('GET Controller|Veículos|Listar', 'info')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await VeiculosModel.findAll({order: [['updatedAt', 'DESC']]}).then((res) => {
      isSucess = true
      retorno.msg = "Sucesso ao listar Veículos."
      retorno.dados = res
      log(`Listando ${res.length} veículos.`, 'alerta')
    }).catch((err) => {
      retorno.msg = "Erro ao listar Veículos"
      retorno.dados = err
      codStatus = 500
      log("ERROR - Controller|Veículos|Listar.findAll", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async exibir(req, res) {
    log('GET Controller|Veículos|Exibir', 'info')
    log(`Exibindo veículo ID: ${req.params.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await VeiculosModel.findByPk(req.params.id).then((res) => {
      if (res === null) {
        retorno.msg = "Veículo não encontrado!"
        retorno.dados = []
        codStatus = 404
      } else {
        retorno.msg = "Sucesso ao exibir o veículo!"
        retorno.dados = res
        isSucess = true
      }
    }).catch((err) => {
      retorno.msg = "Erro ao buscar ID para exibir Veículo"
      retorno.dados = err
      codStatus = 500
      log("ERROR - Controller|Veículos|Exibir.findByPk", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async inserir(req, res) {
    log('POST Controller|Veículos|Inserir', 'info')
    log(`Veículo: ${req.body.modelo} | Placa: ${req.body.placa}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    const payload = {
      modelo: req.body.modelo,
      placa: req.body.placa,
      motorista: req.body.motorista,
      cod_os: req.body.cod_os,
      numero: req.body.numero,
      km_atual: req.body.km_atual,
      km_revisao: req.body.km_revisao,
      ativo: req.body.ativo,
      obs: req.body.obs
    }

    await VeiculosModel.create(payload).then((res) => {
      isSucess = true
      retorno.msg = "Veículo cadastrado com sucesso!"
      retorno.dados = res
    }).catch((err) => {
      retorno.msg = "Erro ao cadastrar Veículo"
      retorno.dados = err
      codStatus = 500
      log("ERROR - Controller|Veículos|Inserir.create", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

  async atualizar(req, res) {
    log('PUT Controller|Veículos|Atualizar', 'info')
    log(`Editando veículo ID: ${req.body.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200
    let veiculoChange

    await VeiculosModel.findByPk(req.body.id).then((res) => {
      if (res === null) {
        retorno.msg = "Veículo não encontrado!"
        codStatus = 404
      } else {
        isSucess = true
        veiculoChange = res
      }
    }).catch((err) => {
      retorno.msg = "Erro ao buscar ID para atualizar Veículo"
      retorno.dados = err
      codStatus = 500
      log("ERROR - Controller|Veículos|Atualizar.findByPk", "erro")
      console.error('\x1b[41m', err, '\x1b[0m')
    })

    if (isSucess) {
      veiculoChange.modelo = req.body.modelo
      veiculoChange.placa = req.body.placa
      veiculoChange.motorista = req.body.motorista
      veiculoChange.cod_os = req.body.cod_os
      veiculoChange.numero = req.body.numero
      veiculoChange.km_atual = req.body.km_atual
      veiculoChange.km_revisao = req.body.km_revisao
      veiculoChange.ativo = req.body.ativo
      veiculoChange.obs = req.body.obs

      await veiculoChange.save().then((res) => {
          retorno.dados = res
          retorno.msg = "Sucesso ao atualizar o Veículo"
        }).catch((err) => {
          retorno.msg = "ERRO ao atualizar o Veículo"
          retorno.dados = err
          isSucess = false
          codStatus = 500
          log("ERROR - Controller|Veículos|Atualizar.save", "erro")
          console.error(err)
        })

      if(req.body.cod_os.length > 3){
        await OSModel.create({id_veiculo: req.body.id, ordem_servico: req.body.cod_os})
        .then((res) => {
          isSucess = true
          retorno.msg = "Sucesso ao atualizar veículo e cadastrar OS."
          log(`Cadastrando OS Edit Veículo.`, 'alerta')
        }).catch((err) => {
          codStatus = 500
          log("ERROR - ControllerVeículo|CadastrarOS.Query", "erro")
          console.error('\x1b[41m', err, '\x1b[0m')
        })
      }
    }

    response(retorno, res, codStatus, isSucess)
  }

  async deletar(req, res){
    log('DELETE Controller|Veículos|Deletar', 'info')
    log(`Deletando veículo ID: ${req.params.id}`, 'alerta')
    let isSucess = false
    let retorno = {}
    let codStatus = 200

    await VeiculosModel.destroy({ where: { id: req.params.id } }).then((res) => {
        if (res === 0) {
            retorno.msg = "Erro ao apagar. Veículo não foi encontrado"
            retorno.dados = res
            codStatus = 404
        } else {
            retorno.msg = "Sucesso ao deletar o Veículo"
            retorno.dados = res
            isSucess = true
        }
    })
    .catch((err) => {
        retorno.msg = "ERRO ao deletar o Veículo"
        retorno.dados = err
        codStatus = 500
        log("ERROR - Controller|Veículos|deletar.destroy", "erro")
        console.error('\x1b[41m', err, '\x1b[0m')
    })

    response(retorno, res, codStatus, isSucess)
  }

}
module.exports = new Veiculo()