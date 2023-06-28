module.exports = function response(objeto, res, status, isSucess){
  if(isSucess){
      objeto.erroGeral = 'nao'
      return res.status(status).json(objeto)
  }else{
      objeto.erroGeral = 'sim'
      return res.status(status).json(objeto)
  }
}