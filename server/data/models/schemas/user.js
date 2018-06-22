const { Schema } = require('mongoose')
const Arduino = require('./arduino')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    picture_url: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    },
    arduinos: [Arduino]
})