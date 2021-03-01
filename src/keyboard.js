const btn = require('./buttons')

module.exports = {
    home: [
        [btn.tasks], 
        [btn.inbox, btn.upcoming, btn.done], 
        // [btn.add], 
    ],
    cancel: [
        [btn.cancel]
    ]
}