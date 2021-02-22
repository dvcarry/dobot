const TelegramBot = require('node-telegram-bot-api');
const token = '1296848762:AAFTApdSoBwMoTYkAdTQEdymNCqQmD-CaN4'
const bot = new TelegramBot(token, { polling: true });

const keyboard = require('./src/keyboard')
const btn = require('./src/buttons')
const API = require('./src/api')

let status = null

bot.onText(/\/start/, async msg => {
    const { id: user_id } = msg.chat;
    sendMessage(user_id, `Привет ${msg.from.first_name}`, keyboard.home)
})




bot.on('message', async msg => {

    const { id: user_id } = msg.chat;



    if (status === 'add') {
        await API.addTask(msg.text)
        status = null
        sendMessage(user_id, 'Готово', keyboard.home)
    } else {
        switch (msg.text) {
            case btn.tasks:
                const tasks = await API.getTasks('today')
                sendListMessage(user_id, tasks, keyboard.home)
                break
            case btn.inbox:
                const resInbox = await API.getTasks('inbox')
                sendListMessage(user_id, resInbox, keyboard.home)
                break
            case btn.add:
                sendMessage(user_id, 'Введи название задачи', keyboard.home)
                status = 'add'
                break
            default:
                break
        }
    }

})


bot.on('callback_query', async query => {
    const user_id = query.message.chat.id
})

function sendMessage(user_id, message, keyboardName) {
    bot.sendMessage(user_id, message, {
        reply_markup: {
            keyboard: keyboardName,
            one_time_keyboard: true
        }
    })
}

function sendListMessage(user_id, data, keyboardName) {
    const message = data.map((item, index) => `${index + 1}. ${item}`).join('\n')
    bot.sendMessage(user_id, message, {
        reply_markup: {
            keyboard: keyboardName,
            one_time_keyboard: true
        }
    })
}

function sendInline(chatID, text, data) {
    const tasksInline = data.map(item => {
        return [{
            text: item.name,
            callback_data: item.id
        }]
    })
    bot.sendMessage(chatID, text, {
        reply_markup: {
            inline_keyboard: tasksInline
        }
    })
}



