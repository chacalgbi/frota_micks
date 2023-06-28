// https://github.com/yagop/node-telegram-bot-api/blob/master/examples/polling.js
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.MICKS_REVISOES_BOT
const bot = new TelegramBot(token, { polling: true }) // Cria um bot que usa 'polling' para buscar novas atualizações

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text.toLowerCase()
    let resp = ''
    console.log(chatId, text)

    if(text === '/start' || text === 'cadastrar'){
        resp = "Olá! Vamos cadastrar seu SmartPhone para receber alertas por aqui? Digite o token do seu produto."
        setTimeout(() => { bot.sendMessage(chatId, resp) }, 500)
    }

})

module.exports = function alertaTelegram(msg) {
    return new Promise((resolve, reject) => {
        bot.sendMessage(process.env.CHAT_ID, msg).then((res) => {
            resolve(res)
        })
        .catch((err) => {
            reject(err.message)
        })
    })
}