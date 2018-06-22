const { Schema } = require('mongoose')
const ArduinoData = require('./arduino')

module.exports = new Schema({
    ip: {
        type: String,
        required: true,
        match: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    },
    port: {
        type: String,
        required:true
    },    
    data: [ArduinoData]
})