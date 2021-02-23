const axios = require('axios')

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
            const todayTasks = data.filter(item => item.plan === type).map(task => ({ id: task.id, name: task.name, index: task.index }))
            return todayTasks
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
    // async setStatusOfUser(user_id, status) {
    //     const now = new Date();
    //     try {
    //         await pool.query('UPDATE users SET status = $2, date = $3 WHERE user_id = $1', [user_id, status, now])            
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
}

