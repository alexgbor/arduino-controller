const mongoose = require('mongoose')
const { Arduino } = require('./schemas')

module.exports = mongoose.model('Arduino', Arduino)