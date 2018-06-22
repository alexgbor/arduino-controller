const mongoose = require('mongoose')
const { ArduinoData } = require('./schemas')

module.exports = mongoose.model('ArduinoData', ArduinoData)