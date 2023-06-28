require('dotenv').config()
const express = require("express")
const cors = require('cors')
const log   = require('./tools/log')
const bd = require('./tools/connectDb')
const routes = require('./tools/routes')
const verificar_os_aberta = require('./tools/verificar_os_aberta')
const verificar_revisoes_proximas = require('./tools/verificar_revisoes_proximas')
var cron = require('node-cron')
const moment = require('moment-timezone')
const app = express()
app.set('view engine', 'ejs')
moment.tz.setDefault('America/Sao_Paulo')

async function testBDIntegrator(){
  await bd.integrator.authenticate().then((res)=>{
    log('Conexão com o Banco de dados INTEGRATOR estabelecida com sucesso!', 'info')
    
  }).catch((erro)=>{
    log('Erro ao conectar no Banco de dados do INTEGRATOR', 'erro')
    console.error(erro)
  })
}

async function testBD(){
	let isConected = false

  await bd.local.authenticate().then((res)=>{
  isConected = true
    log('Conexão com o Banco de dados estabelecida com sucesso!', 'info')
    
  }).catch((erro)=>{
    log('Erro ao conectar no Banco de dados.', 'erro')
    console.error(erro)
  })

	if(isConected){
		await bd.local.sync().then((res)=>{
			log(`Tabelas Sincronizadas. Host:${res.config.host} DataBase:${res.config.database}`, 'alerta')

      cron.schedule(process.env.VERIFICA_OS_ABERTA, () => {
        log('VERIFICANDO ORDENS DE SERVIÇOS EM ABERTO...')
        verificar_os_aberta()
      })

      cron.schedule(process.env.VERIFICA_KILOMETRAGEM, () => {
        log('VERIFICANDO VEÍCULOS PRÓXIMOS DA REVISÃO...')
        verificar_revisoes_proximas()
      })

		}).catch((erro)=>{
			console.error('Erro ao sincronizar tabelas!', erro)
		})
	}
}

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/index', express.static('public'), (req, res) => {
  res.render('index', {servidor: `${process.env.IP_SERVER}:${process.env.PORT}/`, msg: "Faça login para continuar..."})
})

app.use('/main', express.static('public'), (req, res) => {
  res.render('main', {servidor: `${process.env.IP_SERVER}:${process.env.PORT}/`, msg: "Verificando token...."})
})

app.use((req, res, next)=> { //Caso acesse alguma rota que não existe
  res.status(404).json({
    msg: 'Esta rota não existe',
    erroGeral: "sim"
  })})

app.listen(process.env.PORT, () => {
  log(`Controle de Revisoes - Porta: ${process.env.PORT}`, 'info')
  testBD()
  testBDIntegrator()
})