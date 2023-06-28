var axios = require("axios").default

module.exports = function login(user, pass){
  var options = {
    method: 'POST',
    url: process.env.LOGIN,
    headers: {'Content-Type': 'application/json', app_key: process.env.APP_KEY},
    data: {login: user, password: pass, app: 'frotas'}
  }

  return new Promise((resolve, reject) => {
    axios.request(options).then(function (response) {
      resolve(response.data)
    }).catch(function (error) {
      reject(error)
    })
  })
}