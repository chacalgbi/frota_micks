var axios = require("axios").default

module.exports = function auth(token){
  var options = {
    method: 'POST',
    url: process.env.AUTH,
    headers: {'Content-Type': 'application/json', app_key: process.env.APP_KEY},
    data: {token: token, app: 'frotas'}
  }

  return new Promise((resolve, reject) => {
    axios.request(options).then(function (response) {
      resolve(response.data)
    }).catch(function (error) {
      reject(error)
    })
  })
}