const axios = require('axios')
const moment = require("moment");

axios.defaults.baseURL = 'http://82.146.40.11:5002/api/';

const CURRENT_TASK = {
    id: 0,
    name: '',
    type: 'задача',
    period: 0,
    balance: '',
    child: 0,
    goal: false,
    today: false,
    repeat: false,
    plan: 'inbox',
    date: null,
    done: false,
    donedate: null,
    action: null,
    repeatday: 0
}

module.exports = {
    async getTasks(type) {
        try {
            const { data } = await axios.get('tasks')
            let filtredTasks
            if (type === 'today' || type === 'done') {
                filtredTasks = data.filter(item => item.plan === type)
            } else {
                filtredTasks = data.filter(item => item.plan === type && !item.isparent)
            }
            const resultTasks = filtredTasks.map(task => {
                const name = task.childname ? `${task.name} > ${task.childname}` : task.name
                return { id: task.id, name: name, index: task.index }
            })
            return resultTasks
        } catch (error) {
            console.log(error)
        }
    },

    // async getInboxTasks(user_id, type) {
    //     try {
    //         const { data } = await axios.get('tasks')
    //         const inboxTasks = data.filter(item => item.plan === 'inbox').map(task => task.name)
    //         return inboxTasks
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
    async addTask(name) {
        const now = new Date();
        try {
            await axios.post('tasks', { ...CURRENT_TASK, name: name })
        } catch (error) {
            console.log(error)
        }
    },
    async doTask(id) {
        const now = new Date();
        try {
            await axios.put('tasks/do', { id })
        } catch (error) {
            console.log(error)
        }
    },
    async getHabits() {
        const today = moment(new Date()).format('YYYY-MM-DD')
        try {
            await axios.get('habits/' + today)
        } catch (error) {
            console.log(error)
        }
    },
    // async setStatusOfUser(user_id, status) {
    //     const now = new Date();
    //     try {
    //         await pool.query('UPDATE users SET status = $2, date = $3 WHERE user_id = $1', [user_id, status, now])            
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
}

