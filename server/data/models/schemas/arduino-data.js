const { Schema } = require('mongoose')

module.exports = new Schema({
    timestamp: {
        type: Number,
        required:true
    },
    value: {
        type: Number,
        required: true
    }
})