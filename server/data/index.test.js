'use strict'

require('dotenv').config()

const { mongoose, models: { User, Arduino, ArduinoData } } = require('.')
const expect = require('expect')

const { env: { DB_URL } } = process

describe('models (arduinos)', () => {
    before(() => mongoose.connect(DB_URL))

    beforeEach(() => Promise.all([User.remove(), Arduino.deleteMany(), ArduinoData.deleteMany()]))

    describe('create user', () => {
        it('should succeed', () => {
            const arduinodata = new ArduinoData({ timestamp: Date.now(), value: 12341234 })
            const arduino = new Arduino({ ip: '192.168.1.1', port: '5000' })

            const user = new User({ name: 'John', surname: 'Doe', email: 'johndoe@mail.com', password: '123123ab' })
            arduino.data.push(arduinodata)
            user.arduinos.push(arduino)

            return user.save()
                .then(user => {
                    expect(user).toBeDefined()
                    expect(user.name).toBe('John')
                    expect(user.surname).toBe('Doe')
                    expect(user.email).toBe('johndoe@mail.com')
                    expect(user.password).toBe('123123ab')
                    expect(user.arduinos.length).toBe(1)
                    expect(user.arduinos[0].ip).toBe('192.168.1.1')
                    expect(user.arduinos[0].port).toBe('5000')
                    expect(user.arduinos[0].data.length).toBe(1)
                    expect(user.arduinos[0].data.length).toBe(1)
                    expect(typeof user.arduinos[0].data[0].timestamp).toBe('number')
                    expect(user.arduinos[0].data[0].value).toBe(12341234)
                })
        })
    })

    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})