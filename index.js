const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN
const bot = new TelegramBot(token, { polling: true });
require('dotenv').config()

const keyboard = require('./src/keyboard')
const btn = require('./src/buttons')
const API = require('./src/api');
const api = require('./src/api');


bot.onText(/\/start/, async msg => {
    const { id: user_id } = msg.chat;
    sendMessage(user_id, `Привет ${msg.from.first_name}`, keyboard.home)
})

bot.on('message', async msg => {

    const { id: user_id } = msg.chat;

    switch (msg.text) {
        case btn.tasks:
            const tasks = await API.getTasks('today')
            sendInline(user_id, 'Задачи на сегодня', tasks)
            break
        case btn.inbox:
            const resInbox = await API.getTasks('inbox')
            sendListMessage(user_id, resInbox, keyboard.home)
            break
        case btn.upcoming:
            const resUpcoming = await API.getTasks('upcoming')
            const upcomingTasks = resUpcoming.filter(item => item.child === 0)
            sendListMessage(user_id, upcomingTasks, keyboard.home)
            break
        case btn.done:
            const resDone = await API.getTasks('done')
            sendListMessage(user_id, resDone, keyboard.home)
            break
        default:
            await API.addTask(msg.text)
            sendMessage(user_id, 'Готово', keyboard.home)
            break
    }
})


bot.on('callback_query', async query => {
    const user_id = query.message.chat.id
    await api.doTask(query.data)
    sendMessage(user_id, 'Молодцом!', keyboard.home)
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
    const message = data.length > 0 ? data.map((item, index) => `${index + 1}. ${item.name}`).join('\n') : 'Нет задач'
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



