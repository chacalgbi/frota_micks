const { Router } = require("express")
const Auth = require('./authIntegrator')
const log = require('../tools/log')
const Veiculo = require('../controllers/veiculos')
const Revisao = require('../controllers/revisao')
const Os = require('../controllers/os')
const Diversos = require('../controllers/diversos')
//const Revisoes = require('../controllers/')
//const OrdemSer = require('../controllers/')
const routes = new Router()

function isTokenExpired(token){
  if(token){
    const payload = getPayload(token)
    const clockTimestamp = Math.floor(Date.now() / 1000)
    return clockTimestamp > payload.exp
  }else{
    return true
  }
}

function getPayload(token){
  return JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString("utf8")
  )
}

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token']
  
  if(token == undefined || token == '' || token.length < 10){
    log("ERROR - Routes|verifyToken - Token Ausente", "erro")
    return res.status(401).json({
      erroGeral: "sim",
      message: "Token ausente! Faça login para continuar."
    })
  }else{
    if(isTokenExpired(token)){
      log("ERROR - Routes|verifyToken - Token inválido", "erro")
      return res.status(401).json({
        erroGeral: "sim",
        message: "Token inválido! Faça login novamente."
      })
    }else{
      return next()
    }
  }
}

// Veiculos
routes.get   ('/veiculos',    verifyToken, Veiculo.listar)    // Lista todos os Veículos
routes.get   ('/veiculo/:id', verifyToken, Veiculo.exibir)    // Exibir um Veículo
routes.post  ('/veiculo',     verifyToken, Veiculo.inserir)   // Inserir um Veículo
routes.put   ('/veiculo',     verifyToken, Veiculo.atualizar) // Atualiza um Veículo
routes.delete('/veiculo/:id', verifyToken, Veiculo.deletar)   // Deleta um Veículo

// Revisões
routes.get   ('/revisoes',    verifyToken, Revisao.listar)    // Lista todas as Revisões
routes.get   ('/revisao/:id', verifyToken, Revisao.exibir)    // Exibir uma Revisao
routes.post  ('/revisao',     verifyToken, Revisao.inserir)   // Inserir uma Revisao
routes.put   ('/revisao',     verifyToken, Revisao.atualizar) // Atualiza uma Revisao
routes.delete('/revisao/:id', verifyToken, Revisao.deletar)   // Deleta uma Revisao

// Ordens de Serviços
routes.get   ('/oss',    verifyToken, Os.listar)    // Lista todas as Ordens de Serviços
routes.get   ('/os_vei', verifyToken, Os.os_vei)    // Lista todas as Ordens de Serviços trazendos os carros
routes.get   ('/os/:id', verifyToken, Os.exibir)    // Exibir uma Ordem de Serviço
routes.post  ('/os',     verifyToken, Os.inserir)   // Inserir uma Ordem de Serviço
routes.put   ('/os',     verifyToken, Os.atualizar) // Atualiza uma Ordem de Serviço
routes.delete('/os/:id', verifyToken, Os.deletar)   // Deleta uma Ordem de Serviço

//Diversos
routes.post  ('/login', Diversos.login)   // Fazer login

module.exports = routes