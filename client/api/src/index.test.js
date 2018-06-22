'use strict'

require('dotenv').config()

const { mongoose, models: { User, Arduino, ArduinoData } } = require('data')
const { expect } = require('chai')
const arduApi = require('.')
const _ = require('lodash')
const sinon = require('sinon')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const { env: { DB_URL, API_URL, TOKEN_SECRET } } = process

arduApi.url = API_URL

describe('logic (ardu api)', () => {
    const userData = { name: 'John', surname: 'Doe', email: 'jd@mail.com', password: '123123ab' }
    const otherUserData = { name: 'Jack', surname: 'Wayne', email: 'jw@mail.com', password: '456456cd' }
    const fakeUserId = '123456781234567812345678'
    const fakeNoteId = '123456781234567812345678'
    const noteText = 'my note'
    const indexes = []

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => {
        let count = 10 + Math.floor(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return Promise.all([User.remove()]) // or User.deleteMany()
    })

    describe('register user', () => {
        it('should succeed on correct data', () =>
            arduApi.registerUser('John', 'Doe', 'jd@mail.com', '123123ab')
                .then(({ status }) => expect(status).to.equal('OK'))
        )

        it('should fail on already registered user', () =>
            User.create(userData)
                .then(() => {
                    const { name, surname, email, password } = userData

                    return arduApi.registerUser(name, surname, email, password)
                })
                .catch(({ message }) => {
                    expect(message).to.equal(`user with email ${userData.email} already exists`)
                })
        )

        it('should fail on no user name', () =>
            arduApi.registerUser()
                .catch(({ message }) => expect(message).to.equal('user name is not a string'))
        )

        it('should fail on empty user name', () =>
            arduApi.registerUser('')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on blank user name', () =>
            arduApi.registerUser('     ')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on no user surname', () =>
            arduApi.registerUser(userData.name)
                .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
        )

        it('should fail on empty user surname', () =>
            arduApi.registerUser(userData.name, '')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on blank user surname', () =>
            arduApi.registerUser(userData.name, '     ')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on no user email', () =>
            arduApi.registerUser(userData.name, userData.surname)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            arduApi.registerUser(userData.name, userData.surname, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            arduApi.registerUser(userData.name, userData.surname, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            arduApi.registerUser(userData.name, userData.surname, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            arduApi.registerUser(userData.name, userData.surname, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            arduApi.registerUser(userData.name, userData.surname, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        describe('on unexpected server behavior', () => {
            let sandbox

            beforeEach(() => sandbox = sinon.createSandbox())

            afterEach(() => sandbox.restore())

            it('should fail on response status hacked', () => {
                const resolved = new Promise((resolve, reject) => {
                    resolve({ status: 201, data: { status: 'KO' } })
                })

                sandbox.stub(axios, 'post').returns(resolved)

                const { name, surname, email, password } = userData

                return arduApi.registerUser(name, surname, email, password)
                    .catch(({ message }) => {
                        expect(message).to.equal(`unexpected response status 201 (KO)`)
                    })
            })

            it('should fail on email hacked', () => {
                const resolved = new Promise((resolve, reject) => {
                    reject({ response: { data: { error: 'email is not a string' } } })
                })

                sandbox.stub(axios, 'post').returns(resolved)

                const { name, surname, email, password } = userData

                return arduApi.registerUser(name, surname, email, password)
                    .catch(({ message }) => {
                        expect(message).to.equal('email is not a string')
                    })
            })

            it('should fail on server down', () => {
                const resolved = new Promise((resolve, reject) => {
                    reject({ code: 'ECONNREFUSED' })
                })

                sandbox.stub(axios, 'post').returns(resolved)

                const { name, surname, email, password } = userData

                return arduApi.registerUser(name, surname, email, password)
                    .catch(({ message }) => {
                        expect(message).to.equal('could not reach server')
                    })
            })
        })
    })

    describe('authenticate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(() =>
                    arduApi.authenticateUser('jd@mail.com', '123123ab')
                        .then(id => {
                            expect(id).to.exist

                            expect(arduApi.token).not.to.equal('NO-TOKEN')
                        })
                )
        )

        it('should fail on no user email', () =>
            arduApi.authenticateUser()
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            arduApi.authenticateUser('')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            arduApi.authenticateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            arduApi.authenticateUser(userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            arduApi.authenticateUser(userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            arduApi.authenticateUser(userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        describe('on unexpected server behavior', () => {
            let sandbox

            beforeEach(() => sandbox = sinon.createSandbox())

            afterEach(() => sandbox.restore())

            it('should fail on response status hacked', () => {
                const resolved = new Promise((resolve, reject) => {
                    resolve({ status: 200, data: { status: 'KO' } })
                })

                sandbox.stub(axios, 'post').returns(resolved)

                const { email, password } = userData

                return arduApi.authenticateUser(email, password)
                    .catch(({ message }) => {
                        expect(message).to.equal(`unexpected response status 200 (KO)`)
                    })
            })

            it('should fail on email hacked', () => {
                const resolved = new Promise((resolve, reject) => {
                    reject({ response: { data: { error: 'email is not a string' } } })
                })

                sandbox.stub(axios, 'post').returns(resolved)

                const { email, password } = userData

                return arduApi.authenticateUser(email, password)
                    .catch(({ message }) => {
                        expect(message).to.equal('email is not a string')
                    })
            })

            it('should fail on server down', () => {
                const resolved = new Promise((resolve, reject) => {
                    reject({ code: 'ECONNREFUSED' })
                })

                sandbox.stub(axios, 'post').returns(resolved)

                const { email, password } = userData

                return arduApi.authenticateUser(email, password)
                    .catch(({ message }) => {
                        expect(message).to.equal('could not reach server')
                    })
            })
        })
    })

    describe('retrieve user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    const token = jwt.sign({ id }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.retrieveUser(id)
                })
                .then(user => {
                    expect(user).to.exist

                    const { name, surname, email, _id, password, notes } = user

                    expect(name).to.equal('John')
                    expect(surname).to.equal('Doe')
                    expect(email).to.equal('jd@mail.com')

                    expect(_id).to.be.undefined
                    expect(password).to.be.undefined
                    expect(notes).to.be.undefined
                })
        )

        it('should fail on no user id', () =>
            arduApi.retrieveUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.retrieveUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.retrieveUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        describe('on unexpected server behavior', () => {
            let sandbox

            beforeEach(() => sandbox = sinon.createSandbox())

            afterEach(() => sandbox.restore())

            it('should fail on response status hacked', () => {
                const resolved = new Promise((resolve, reject) => {
                    resolve({ status: 200, data: { status: 'KO' } })
                })

                sandbox.stub(axios, 'get').returns(resolved)

                return arduApi.retrieveUser(fakeUserId)
                    .catch(({ message }) => {
                        expect(message).to.equal(`unexpected response status 200 (KO)`)
                    })
            })

            it('should fail on id hacked', () => {
                const resolved = new Promise((resolve, reject) => {
                    reject({ response: { data: { error: 'user id is not a string' } } })
                })

                sandbox.stub(axios, 'get').returns(resolved)

                return arduApi.retrieveUser(fakeUserId)
                    .catch(({ message }) => {
                        expect(message).to.equal('user id is not a string')
                    })
            })

            it('should fail on server down', () => {
                const resolved = new Promise((resolve, reject) => {
                    reject({ code: 'ECONNREFUSED' })
                })

                sandbox.stub(axios, 'get').returns(resolved)

                return arduApi.retrieveUser(fakeUserId)
                    .catch(({ message }) => {
                        expect(message).to.equal('could not reach server')
                    })
            })
        })
    })

    describe('udpate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    const token = jwt.sign({ id }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.updateUser(id, 'Jack', 'Wayne', 'jd@mail.com', '123123ab', 'jw@mail.com', '456456cd')
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.exist

                            const { name, surname, email, password } = user

                            expect(user.id).to.equal(id)
                            expect(name).to.equal('Jack')
                            expect(surname).to.equal('Wayne')
                            expect(email).to.equal('jw@mail.com')
                            expect(password).to.equal('456456cd')
                        })
                })
        )

        it('should fail on changing email to an already existing user\'s email', () =>
            Promise.all([
                User.create(userData),
                User.create(otherUserData)
            ])
                .then(([{ id: id1 }, { id: id2 }]) => {
                    const token = jwt.sign({ id: id1 }, TOKEN_SECRET)

                    arduApi.token = token

                    const { name, surname, email, password } = userData

                    return arduApi.updateUser(id1, name, surname, email, password, otherUserData.email)
                })
                .catch(({ message }) => expect(message).to.equal(`user with email ${otherUserData.email} already exists`))
        )

        it('should fail on no user id', () =>
            arduApi.updateUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.updateUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.updateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no user name', () =>
            arduApi.updateUser(fakeUserId)
                .catch(({ message }) => expect(message).to.equal('user name is not a string'))
        )

        it('should fail on empty user name', () =>
            arduApi.updateUser(fakeUserId, '')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on blank user name', () =>
            arduApi.updateUser(fakeUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on no user surname', () =>
            arduApi.updateUser(fakeUserId, userData.name)
                .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
        )

        it('should fail on empty user surname', () =>
            arduApi.updateUser(fakeUserId, userData.name, '')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on blank user surname', () =>
            arduApi.updateUser(fakeUserId, userData.name, '     ')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on no user email', () =>
            arduApi.updateUser(fakeUserId, userData.name, userData.surname)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            arduApi.updateUser(fakeUserId, userData.name, userData.surname, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            arduApi.updateUser(fakeUserId, userData.name, userData.surname, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            arduApi.updateUser(fakeUserId, userData.name, userData.surname, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            arduApi.updateUser(fakeUserId, userData.name, userData.surname, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            arduApi.updateUser(fakeUserId, userData.name, userData.surname, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('unregister user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    const token = jwt.sign({ id }, TOKEN_SECRET)

                    arduApi.token = token

                    const { email, password } = userData

                    return arduApi.unregisterUser(id, email, password)
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.be.null
                        })
                })
        )

        it('should fail on no user id', () =>
            arduApi.unregisterUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.unregisterUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.unregisterUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no user email', () =>
            arduApi.unregisterUser(fakeUserId)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            arduApi.unregisterUser(fakeUserId, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            arduApi.unregisterUser(fakeUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            arduApi.unregisterUser(fakeUserId, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            arduApi.unregisterUser(fakeUserId, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            arduApi.unregisterUser(fakeUserId, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('add arduino', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    const token = jwt.sign({ id }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.addArduino(id, '192.168.1.1', '5000')
                        .then(arduId => {
                            expect(arduId).to.be.a('string')
                            expect(arduId).to.exist

                            return User.findById(id)
                                .then(user => {
                                    expect(user).to.exist

                                    expect(user.arduinos).to.exist
                                    expect(user.arduinos.length).to.equal(1)

                                    const [{ id, ip, port }] = user.arduinos

                                    expect(id).to.equal(arduId)
                                    expect(ip).to.equal('192.168.1.1')
                                    expect(port).to.equal('5000')
                                })
                        })
                })
        )

        it('should fail on wrong user id', () =>
            User.create(userData)
                .then(({ id }) => {
                    const token = jwt.sign({ id }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.addArduino(fakeUserId, noteText)
                        .catch(({ message }) => expect(message).to.equal(`user id ${fakeUserId} does not match token user id ${id}`))
                })
        )

        it('should fail on no user id', () =>
            arduApi.addArduino()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.addArduino('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.addArduino('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no ip', () => {
            arduApi.addArduino(fakeUserId)
                .catch(({ message }) => expect(message).to.equal('ip is not a string'))
        })

        it('should fail on empty ip', () =>
            arduApi.addArduino(fakeUserId, '')
                .catch(({ message }) => expect(message).to.equal('ip is empty or blank'))
        )

        it('should fail on blank ip', () =>
            arduApi.addArduino(fakeUserId, '   ')
                .catch(({ message }) => expect(message).to.equal('ip is empty or blank'))
        )
    })

    describe('retrieve arduino', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId, arduinos: [{ id: arduId }] }) => {
                    const token = jwt.sign({ id: userId }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.retrieveArduino(userId, arduId)
                })
                .then(({ id, ip, port }) => {
                    expect(id).to.equal(ardu.id)
                    expect(ip).to.equal(ardu.ip)
                    expect(port).to.equal(ardu.port)
                })
        })

        it('should fail on non user id', () =>
            arduApi.retrieveArduino()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.retrieveArduino('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.retrieveArduino('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on wrong user id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ arduinos: [{ id: arduId }] }) => {
                    const token = jwt.sign({ id: user.id }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.retrieveArduino(fakeUserId, arduId)
                        .catch(({ message }) => expect(message).to.equal(`user id ${fakeUserId} does not match token user id ${user.id}`))
                })
        })

        it('should fail on no ardu id', () =>
            arduApi.retrieveArduino(fakeUserId)
                .catch(({ message }) => expect(message).to.equal('ardu id is not a string'))
        )

        it('should fail on empty ardu id', () =>
            arduApi.retrieveArduino(fakeUserId, '')
                .catch(({ message }) => expect(message).to.equal('ardu id is empty or blank'))
        )

        it('should fail on blank ardu id', () =>
            arduApi.retrieveArduino(fakeUserId, '       ')
                .catch(({ message }) => expect(message).to.equal('ardu id is empty or blank'))
        )

        it('should fail on wrong ardu id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId }) => {
                    const token = jwt.sign({ id: userId }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.retrieveArduino(userId, '192.168.1.2')
                        .catch(({ message }) => expect(message).to.equal(`no arduino found with id 192.168.1.2`))
                })
        })
    })

    describe('list arduinos', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)

            const arduinos = indexes.map(index => new Arduino({ ip: `192.168.1.${index}`, port: '5000' }))

            user.arduinos = arduinos

            return user.save()
                .then(({ id: userId, arduinos }) => {
                    const validArduIds = _.map(arduinos, 'id')
                    const validArduIps = _.map(arduinos, 'ip')
                    const validArduPorts = _.map(arduinos, 'port')

                    const token = jwt.sign({ id: userId }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.listArduinos(userId)
                        .then(arduinos => {
                            expect(arduinos).to.exist
                            expect(arduinos.length).to.equal(indexes.length)

                            arduinos.forEach(({ id, ip, port, _id }) => {
                                expect(validArduIds).to.include(id)
                                expect(validArduIps).to.include(ip)
                                expect(validArduPorts).to.include(port)
                                expect(_id).not.to.exist
                            })
                        })
                })
        })

        it('should fail on non user id', () =>
            arduApi.listArduinos()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.listArduinos('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.listArduinos('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })

    describe('update arduino', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id: userId }) =>
                    User.findByIdAndUpdate(userId, { $push: { arduinos: { ip: '192.168.1.1', port: '5000' } } }, { new: true })
                        .then(user => {
                            const arduId = user.arduinos[user.arduinos.length - 1].id

                            const newArduIp = '192.168.1.2'

                            const newArduPort = '5001'

                            const token = jwt.sign({ id: user.id }, TOKEN_SECRET)

                            arduApi.token = token

                            return arduApi.updateArduino(userId, arduId, newArduIp, newArduPort)
                                .then(res => {
                                    expect(res).to.be.true

                                    return User.findById(userId)
                                })
                                .then(({ arduinos }) => {
                                    const [{ id, ip, port }] = arduinos

                                    expect(id).to.equal(arduId)
                                    expect(ip).to.equal('192.168.1.2')
                                    expect(port).to.equal('5001')
                                })
                        })
                )
        )

        it('should fail on non user id', () =>
            arduApi.updateArduino()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.updateArduino('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.updateArduino('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on wrong user id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ arduinos: [{ id: arduId }] }) => {
                    const token = jwt.sign({ id: user.id }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.updateArduino(fakeUserId, arduId, '192.168.1.2', '5001')
                        .catch(({ message }) => expect(message).to.equal(`user id ${fakeUserId} does not match token user id ${user.id}`))
                })
        })

        it('should fail on wrong ardu id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId }) => {
                    const token = jwt.sign({ id: user.id }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.updateArduino(userId, fakeNoteId, '192.168.1.2', '5001')
                        .catch(({ message }) => expect(message).to.equal(`no arduino found with id ${fakeNoteId}`))
                })
        })
    })

    describe('remove arduino', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip:'192.168.1.1', port:'5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId, arduinos: [{ id: arduId, ip, port }] }) => {
                    const token = jwt.sign({ id: userId }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.removeArduino(userId, arduId)
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(userId)
                        })
                        .then(({ arduinos }) => {
                            expect(arduinos).to.exist
                            expect(arduinos.length).to.equal(0)
                        })
                })
        })

        it('should fail on non user id', () =>
            arduApi.removeArduino()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.removeArduino('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.removeArduino('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on wrong user id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip:'192.168.1.1', port:'5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ arduinos: [{ id: arduId, ip, port }] }) => {
                    const token = jwt.sign({ id: user.id }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.removeArduino(fakeUserId, arduId)
                        .catch(({ message }) => expect(message).to.equal(`user id ${fakeUserId} does not match token user id ${user.id}`))
                })
        })

        it('should fail on no ardu id', () =>
            arduApi.removeArduino(fakeUserId)
                .catch(({ message }) => expect(message).to.equal('arduino id is not a string'))
        )

        it('should fail on empty ardu id', () =>
            arduApi.removeArduino(fakeUserId, '')
                .catch(({ message }) => expect(message).to.equal('arduino id is empty or blank'))
        )

        it('should fail on blank ardu id', () =>
            arduApi.removeArduino(fakeUserId, '       ')
                .catch(({ message }) => expect(message).to.equal('arduino id is empty or blank'))
        )

        it('should fail on wrong ardu id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip:'192.168.1.1', port:'5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId }) => {
                    const token = jwt.sign({ id: userId }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.removeArduino(userId, fakeNoteId)
                        .catch(({ message }) => expect(message).to.equal(`no arduino found with id ${fakeNoteId}`))
                })
        })
    })

    describe('find arduinos', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)

            user.arduinos.push(new Arduino({ ip: '192.168.1.1', port:'5000' }))
            user.arduinos.push(new Arduino({ ip: '192.168.1.2', port:'5001' }))
            user.arduinos.push(new Arduino({ ip: '192.168.1.3', port:'5002' }))
            user.arduinos.push(new Arduino({ ip: '192.168.1.4', port:'5003' }))
            user.arduinos.push(new Arduino({ ip: '192.161.2.1', port:'5004' }))

            const chunk = '1.2'

            return user.save()
                .then(({ id: userId, arduinos }) => {
                    const matchingArdus = arduinos.filter(ardu => ardu.ip.includes(chunk))

                    const validArduIds = _.map(matchingArdus, 'id')
                    const validArduIps = _.map(matchingArdus, 'ip')

                    const token = jwt.sign({ id: userId }, TOKEN_SECRET)

                    arduApi.token = token

                    return arduApi.findArduinos(userId, chunk)
                        .then(arduinos => {
                            expect(arduinos).to.exist
                            expect(arduinos.length).to.equal(matchingArdus.length)

                            arduinos.forEach(({ id, ip, _id }) => {
                                expect(validArduIds).to.include(id)
                                expect(validArduIps).to.include(ip)
                                expect(_id).not.to.exist
                            })
                        })
                })
        })

        it('should fail on non user id', () =>
            arduApi.findArduinos()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            arduApi.findArduinos('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            arduApi.findArduinos('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no chunk', () =>
            arduApi.findArduinos(fakeUserId)
                .catch(({ message }) => expect(message).to.equal('chunk is not a string'))
        )

        it('should fail on empty chunk', () =>
            arduApi.findArduinos(fakeUserId, '')
                .catch(({ message }) => expect(message).to.equal('chunk is empty'))
        )
    })

    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})