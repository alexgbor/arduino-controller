'use strict'

require('dotenv').config()

const { mongoose, models: { User, Arduino, ArduinoData } } = require('data')
const { expect } = require('chai')
const logic = require('.')
const _ = require('lodash')

const { env: { DB_URL } } = process

describe('logic (user)', () => {
    const userData = { name: 'John', surname: 'Doe', email: 'jd@mail.com', picture_url: 'https://fch.lisboa.ucp.pt/sites/default/files/assets/images/avatar-fch_8.png', password: '123123ab' }
    const otherUserData = { name: 'Jack', surname: 'Wayne', email: 'jw@mail.com',picture_url:'https://fch.lisboa.ucp.pt/sites/default/files/assets/images/avatar-fch_7.png', password: '456456cd' }
    const dummyUserId = '123456781234567812345678'
    const dummyArduId = '234523452345234523452345'


    const indexes = []

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => {
        let count = 10 + Math.floor(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return Promise.all([User.remove()/*, Note.deleteMany()*/])
    })

    describe('register user', () => {
        it('should succeed on correct data', () =>
            logic.registerUser('John', 'Doe', 'jd@mail.com', '123123ab')
                .then(res => expect(res).to.be.true)
        )

        it('should fail on wrong regex password', () =>
            logic.registerUser('Alex', 'Gómez', 'ag@mail.com', '123')
                .catch(({ message }) => {
                    expect(message).to.equal('Wrong password')
                })
        )

        it('should fail on wrong regex email', () =>
            logic.registerUser('Alex', 'Gómez', 'agmail.com', '123123ab')
                .catch(({ message }) => {
                    expect(message).to.equal('Wrong email')
                })
        )

        it('should fail on already registered user', () =>
            User.create(userData)
                .then(() => {
                    const { name, surname, email, password } = userData

                    return logic.registerUser(name, surname, email, password)
                })
                .catch(({ message }) => {
                    expect(message).to.equal(`user with email ${userData.email} already exists`)
                })
        )

        it('should fail on no user name', () =>
            logic.registerUser()
                .catch(({ message }) => expect(message).to.equal('user name is not a string'))
        )

        it('should fail on empty user name', () =>
            logic.registerUser('')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on blank user name', () =>
            logic.registerUser('     ')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on no user surname', () =>
            logic.registerUser(userData.name)
                .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
        )

        it('should fail on empty user surname', () =>
            logic.registerUser(userData.name, '')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on blank user surname', () =>
            logic.registerUser(userData.name, '     ')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.registerUser(userData.name, userData.surname)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.registerUser(userData.name, userData.surname, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.registerUser(userData.name, userData.surname, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.registerUser(userData.name, userData.surname, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.registerUser(userData.name, userData.surname, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.registerUser(userData.name, userData.surname, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('authenticate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(() =>
                    logic.authenticateUser('jd@mail.com', '123123ab')
                        .then(id => expect(id).to.exist)
                )
        )

        it('should fail on no user email', () =>
            logic.authenticateUser()
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.authenticateUser('')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.authenticateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.authenticateUser(userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.authenticateUser(userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.authenticateUser(userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('retrieve user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.retrieveUser(id)
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
            logic.retrieveUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.retrieveUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.retrieveUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })

    describe('update user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.updateUser(id, 'Jack', 'Wayne', 'jd@mail.com', '123123ab', 'https://fch.lisboa.ucp.pt/sites/default/files/assets/images/avatar-fch_8.png', 'jw@mail.com', '456456cd')
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
                    const { name, surname, email, picture_url, password } = userData

                    return logic.updateUser(id1, name, surname, email, password, picture_url, otherUserData.email)
                })
                .catch(({ message }) => expect(message).to.equal(`user with email ${otherUserData.email} already exists`))
        )

        it('should fail on no user id', () =>
            logic.updateUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.updateUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.updateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no user name', () =>
            logic.updateUser(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('user name is not a string'))
        )

        it('should fail on empty user name', () =>
            logic.updateUser(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on blank user name', () =>
            logic.updateUser(dummyUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on no user surname', () =>
            logic.updateUser(dummyUserId, userData.name)
                .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
        )

        it('should fail on empty user surname', () =>
            logic.updateUser(dummyUserId, userData.name, '')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on blank user surname', () =>
            logic.updateUser(dummyUserId, userData.name, '     ')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on wrong new password regex', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email, userData.picture_url, userData.password, userData.email, '123')
                .catch(({ message }) => expect(message).to.equal('Wrong new password'))
        )

        it('should fail on wrong new email regex', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email, userData.password, 'agmail.com', userData.password)
                .catch(({ message }) => expect(message).to.equal('Wrong new email'))
        )

        it('should fail on no user password', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('unregister user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.unregisterUser(id, 'jd@mail.com', '123123ab')
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
            logic.unregisterUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.unregisterUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.unregisterUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.unregisterUser(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.unregisterUser(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.unregisterUser(dummyUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.unregisterUser(dummyUserId, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.unregisterUser(dummyUserId, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.unregisterUser(dummyUserId, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('add arduino', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.addArduino(id, '192.162.1.1', '5000')
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
                                    expect(ip).to.equal('192.162.1.1')
                                    expect(port).to.equal('5000')
                                })
                        })
                })
        )

        it('should fail on wrong user id', () =>
            logic.addArduino(dummyUserId, '192.168.1.1', '5000')
                .catch(({ message }) => expect(message).to.equal(`no user found with id ${dummyUserId}`))
        )

        it('should fail on no user id', () =>
            logic.addArduino()
                .catch(({ message }) => expect(message).to.equal('You must input a valid ip'))
        )

        it('should fail on empty user id', () =>
            logic.addArduino('', '192.168.1.1', '5000')
                .catch(({ message }) => expect(message).to.equal('userId is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.addArduino('     ', '192.168.1.1', '5000')
                .catch(({ message }) => expect(message).to.equal('userId is empty or blank'))
        )

        it('should fail on empty user port', () =>
            logic.addArduino(dummyUserId, '192.168.1.1', '')
                .catch(({ message }) => expect(message).to.equal('port is empty or blank'))
        )

        it('should fail on no ip', () => {
            logic.addArduino(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('You must input a valid ip'))
        })

        it('should fail on empty ip', () =>
            logic.addArduino(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('You must input a valid ip'))
        )

        it('should fail on blank ip', () =>
            logic.addArduino(dummyUserId, '   ')
                .catch(({ message }) => expect(message).to.equal('Empty ip'))
        )

    })

    describe('retrieve arduino', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)
            const arduIp = '192.168.1.1'
            const arduPort = '5000'
            const ardu = new Arduino({ ip: arduIp, port: arduPort })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId, arduinos: [{ id: arduId, port: arduPort }] }) => {
                    return logic.retrieveArduino(userId, arduId)
                })
                .then(({ id, ip, _id, port }) => {
                    expect(id).to.equal(ardu.id)
                    expect(ip).to.equal(ardu.ip)
                    expect(port).to.equal(ardu.port)
                    expect(_id).not.to.exist
                })
        })

        it('should fail on non user id', () =>
            logic.retrieveArduino()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.retrieveArduino('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.retrieveArduino('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on wrong user id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ arduinos: [{ id: arduId }] }) => {
                    return logic.retrieveArduino(dummyUserId, arduId)
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${dummyUserId}`))
                })
        })


        it('should fail on no arduId', () =>
            logic.retrieveArduino(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('arduId is not a string'))
        )

        it('should fail on empty arduId', () =>
            logic.retrieveArduino(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('arduId is empty or blank'))
        )

        it('should fail on blank arduId', () =>
            logic.retrieveArduino(dummyUserId, '       ')
                .catch(({ message }) => expect(message).to.equal('arduId is empty or blank'))
        )

        it('should fail on wrong arduId', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId }) => {
                    return logic.retrieveArduino(userId, dummyArduId)
                        .catch(({ message }) => expect(message).to.equal(`no arduino found with id ${dummyArduId}`))
                })
        })

    })

    describe('list arduinos', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)
            const dummyIp = '192.168.1.'
            const arduinos = indexes.map(index => new Arduino({ ip: `${dummyIp}${index}`, port: `5000 ${index}` }))

            user.arduinos = arduinos

            return user.save()
                .then(({ id: userId, arduinos }) => {
                    const validArduinoIds = _.map(arduinos, 'id')
                    const validArduinoIps = _.map(arduinos, 'ip')
                    const validArduinoPorts = _.map(arduinos, 'port')

                    return logic.listArduinos(userId)
                        .then(arduinos => {
                            expect(arduinos).to.exist
                            expect(arduinos.length).to.equal(indexes.length)

                            arduinos.forEach(({ id, ip, _id, port }) => {
                                expect(validArduinoIds).to.include(id)
                                expect(validArduinoIps).to.include(ip)
                                expect(validArduinoPorts).to.include(port)
                                expect(_id).not.to.exist
                            })
                        })
                })
        })

        it('should fail on non user id', () =>
            logic.listArduinos()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.listArduinos('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.listArduinos('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })

    describe('remove arduino', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId, arduinos: [{ id: arduId }] }) => {
                    return logic.removeArduino(userId, arduId)
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
            logic.removeArduino()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.removeArduino('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.removeArduino('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on wrong user id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ arduinos: [{ id: arduId }] }) => {
                    return logic.removeArduino(dummyUserId, arduId)
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${dummyUserId}`))
                })
        })

        it('should fail on no arduino id', () =>
            logic.removeArduino(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('arduino id is not a string'))
        )

        it('should fail on empty arduino id', () =>
            logic.removeArduino(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('arduino id is empty or blank'))
        )

        it('should fail on blank arduino id', () =>
            logic.removeArduino(dummyUserId, '       ')
                .catch(({ message }) => expect(message).to.equal('arduino id is empty or blank'))
        )

        it('should fail on wrong arduino id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '192.168.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId }) => {
                    return logic.removeArduino(userId, dummyArduId)
                        .catch(({ message }) => expect(message).to.equal(`no arduino found with id ${dummyArduId}`))
                })
        })
    })

    describe('update arduino', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id: userId }) =>
                    User.findByIdAndUpdate(userId, { $push: { arduinos: { ip: '192.168.1.1', port: '5000' } } }, { new: true })
                        .then(user => {
                            const arduId = user.arduinos[user.arduinos.length - 1].id

                            const newArduIp = '193.168.1.2'
                            const newArduPort = '3000'

                            return logic.updateArduino(userId, arduId, newArduIp, newArduPort)
                                .then(res => {
                                    expect(res).to.be.true

                                    return User.findById(userId)
                                })
                                .then(({ arduinos }) => {
                                    const [{ id, ip, port }] = arduinos

                                    expect(id).to.equal(arduId)
                                    expect(ip).to.equal(newArduIp)
                                    expect(port).to.equal(newArduPort)
                                })
                        })
                )
        )

        it('should fail on non user id', () =>
            logic.updateArduino()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.updateArduino('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.updateArduino('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on wrong user id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '196.162.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ arduinos: [{ id: arduId }] }) => {
                    return logic.updateArduino(dummyUserId, arduId, '192.168.1.2', '3000')
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${dummyUserId}`))
                })
        })

        it('should fail on wrong arduino id', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '196.162.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId }) => {
                    return logic.updateArduino(userId, dummyArduId, `196.162.1.2`, '3000')
                        .catch(({ message }) => expect(message).to.equal(`no arduino found with id ${dummyArduId}`))
                })
        })

        it('should fail on wrong port', () => {
            const user = new User(userData)
            const ardu = new Arduino({ ip: '196.162.1.1', port: '5000' })

            user.arduinos.push(ardu)

            return user.save()
                .then(({ id: userId }) => {
                    return logic.updateArduino(userId, dummyArduId, `196.162.1.2`, '')
                        .catch(({ message }) => expect(message).to.equal('port is empty or blank'))
                })
        })
    })

    describe('find arduinos', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)

            user.arduinos.push(new Arduino({ ip: '192.168.1.1', port: '5000' }))
            user.arduinos.push(new Arduino({ ip: '192.168.1.2', port: '5001' }))
            user.arduinos.push(new Arduino({ ip: '192.168.1.3', port: '5002' }))
            user.arduinos.push(new Arduino({ ip: '192.168.2.4', port: '5003' }))
            user.arduinos.push(new Arduino({ ip: '192.168.2.5', port: '5000' }))

            const ipChunk = '.2.'

            return user.save()
                .then(({ id: userId, arduinos }) => {
                    const matchingArduinos = arduinos.filter(arduino => arduino.ip.includes(ipChunk))

                    const validArduinoIds = _.map(matchingArduinos, 'id')
                    const validArduinoIps = _.map(matchingArduinos, 'ip')

                    return logic.findArduinos(userId, ipChunk)
                        .then(arduinos => {
                            expect(arduinos).to.exist
                            expect(arduinos.length).to.equal(matchingArduinos.length)

                            arduinos.forEach(({ id, ip, _id }) => {
                                expect(validArduinoIds).to.include(id)
                                expect(validArduinoIps).to.include(ip)
                                expect(_id).not.to.exist
                            })
                        })
                })
        })

        it('should fail on non user id', () =>
            logic.findArduinos()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.findArduinos('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.findArduinos('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no ip', () =>
            logic.findArduinos(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('chunk is not a string'))
        )

        it('should fail on empty ip', () =>
            logic.findArduinos(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('chunk is empty'))
        )
    })

    describe('addArduinoData', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)

            user.arduinos.push(new Arduino({ ip: '192.168.1.1', port: '5000' }))

            return user.save()
                .then(({ id, arduinos: [{ id: arduId }] }) => {
                    return logic.addArduinoData(id, arduId, 123123)
                        .then(dataId => {

                            expect(dataId).to.be.a('string')
                            expect(dataId).to.exist

                            return User.findById(id)
                                .then(user => {

                                    expect(user.arduinos).to.exist
                                    expect(user.arduinos.length).to.equal(1)
                                    expect(user.arduinos[0].data.length).to.equal(1)
                                    const { _id: id, timestamp, value } = user.arduinos[0].data[0]

                                    expect(id.toString()).to.equal(dataId)
                                    expect(timestamp).to.be.a('number')
                                    expect(value).to.equal(123123)
                                })
                        })
                })
        })

        it('should fail on no arduino id', () =>
            logic.addArduinoData(dummyUserId, undefined, 312123)
                .catch(({ message }) => expect(message).to.equal('arduId is not a string'))
        )

        it('should fail on empty arduino id', () =>
            logic.addArduinoData(dummyUserId, '', 123321)
                .catch(({ message }) => expect(message).to.equal('arduId is empty or blank'))
        )

        it('should fail on wrong arduino id', () => {
            const user = new User(userData)

            user.arduinos.push(new Arduino({ ip: '192.168.1.1', port: '5000' }))

            return user.save()
                .then(({ id, arduinos: [{ id: arduId }] }) => {
                    return logic.addArduinoData(id, dummyArduId, 123123)
                        .catch(({ message }) => expect(message).to.equal(`no arduino found with id ${dummyArduId}`))
                })

        })
    })

    describe('retrieveArduinoData', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)

            user.arduinos.push(new Arduino({ ip: '192.168.1.1', port: '5000' }))
            user.arduinos[0].data.push(new ArduinoData({ timestamp: Date.now(), value: 123123 }))

            return user.save()
                .then(({ id, arduinos: [{ id: arduId }] }) => {
                    return logic.retrieveArduinoData(id, arduId)
                        .then(data => {
                            expect(data).to.exist
                            expect(data.length).to.equal(1)
                            expect(data[0].timestamp).to.be.a('number')
                            expect(data[0].value).to.equal(123123)
                        })
                })
        })

        it('should fail on no arduino id', () =>
            logic.retrieveArduinoData(dummyUserId, undefined)
                .catch(({ message }) => expect(message).to.equal('arduId is not a string'))
        )

        it('should fail on empty arduino id', () =>
            logic.retrieveArduinoData(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('arduId is empty or blank'))
        )

        it('should fail on wrong arduino id', () => {
            const user = new User(userData)

            user.arduinos.push(new Arduino({ ip: '192.168.1.1', port: '5000' }))
            user.arduinos[0].data.push(new ArduinoData({ timestamp: Date.now(), value: 123123 }))

            return user.save()
                .then(({ id, arduinos: [{ id: arduId }] }) => {
                    return logic.retrieveArduinoData(id, dummyArduId)
                        .catch(({ message }) => expect(message).to.equal(`No user with arduino ${dummyArduId}`))
                })

        })
    })

    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})