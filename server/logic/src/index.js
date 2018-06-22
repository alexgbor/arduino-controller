'use strict'
const fetch = require('node-fetch');

const { models: { User, Arduino, ArduinoData } } = require('data')

global.Headers = fetch.Headers;

const logic = {
    /**
     * Registers a new user in the database.
     * 
     * @param {string} name 
     * @param {string} surname 
     * @param {string} email 
     * @param {string} password 
     * 
     * @returns {Promise<boolean>}
     */


    registerUser(name, surname, email, password) {
        return Promise.resolve()
            .then(() => {
                if (typeof name !== 'string') throw Error('user name is not a string')

                if (!(name = name.trim()).length) throw Error('user name is empty or blank')

                if (typeof surname !== 'string') throw Error('user surname is not a string')

                if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) throw Error('Wrong email')

                if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) throw Error('Wrong password')

                return User.findOne({ email })
                    .then(user => {
                        if (user) throw Error(`user with email ${email} already exists`)
                        const picture_url = 'https://fch.lisboa.ucp.pt/sites/default/files/assets/images/avatar-fch_8.png'
                        return User.create({ name, surname, email, picture_url, password })
                            .then(() => true)
                    })
            })
    },

    /**
     * 
     * Allows you to retrieve a userId of a user.
     * 
     * @param {string} email 
     * @param {string} password 
     * 
     * @returns {Promise<string>}
     */
    authenticateUser(email, password) {
        return Promise.resolve()
            .then(() => {
                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ email, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                return user.id
            })
    },

    /**
     * 
     * Retrieves the non sensitive information of a user.
     * 
     * @param {string} id
     * 
     * @returns {Promise<User>} 
     */

    retrieveUser(id) {
        return Promise.resolve()
            .then(() => {
                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                return User.findById(id).select({ _id: 0, name: 1, surname: 1, email: 1, picture_url: 1 })
            })
            .then(user => {
                if (!user) throw Error(`no user found with id ${id}`)

                return user
            })
    },

    /**
     * 
     * Updates the picture_url, email and password.
     * 
     * @param {string} id 
     * @param {string} name 
     * @param {string} surname 
     * @param {string} email 
     * @param {string} password 
     * @param {string} picture_url
     * @param {string} newEmail 
     * @param {string} newPassword 
     * 
     * @returns {Promise<boolean>}
     */

    updateUser(id, name, surname, email, password, picture_url, newEmail, newPassword) {
        return Promise.resolve()
            .then(() => {
                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                if (typeof name !== 'string') throw Error('user name is not a string')

                if (!(name = name.trim()).length) throw Error('user name is empty or blank')

                if (typeof surname !== 'string') throw Error('user surname is not a string')

                if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                if (newEmail && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newEmail)) throw Error('Wrong new email')

                if (newPassword && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) throw Error('Wrong new password')
                return User.findOne({ email, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

                if (newEmail) {
                    return User.findOne({ email: newEmail })
                        .then(_user => {
                            if (_user && _user.id !== id) throw Error(`user with email ${newEmail} already exists`)

                            return user
                        })
                }

                return user
            })
            .then(user => {
                user.name = name
                user.surname = surname
                user.email = newEmail ? newEmail : email
                user.password = newPassword ? newPassword : password
                user.picture_url = picture_url ? picture_url : 'https://fch.lisboa.ucp.pt/sites/default/files/assets/images/avatar-fch_8.png'

                return user.save()
            })
            .then(() => true)
    },

    /**
     * Removes a user from the database.
     * 
     * @param {string} id 
     * @param {string} email 
     * @param {string} password 
     * 
     * @returns {Promise<boolean>}
     */
    unregisterUser(id, email, password) {
        return Promise.resolve()
            .then(() => {
                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ email, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

                return user.remove()
            })
            .then(() => true)
    },

    /**
     * 
     * Adds an arduino attached to a user.
     * 
     * @param {string} userId 
     * @param {string} ip 
     * @param {string} port 
     * 
     * @returns {Promise<string>}
     */

    addArduino(userId, ip, port) {

        return Promise.resolve()
            .then(() => {
                if (!ip) throw Error('You must input a valid ip')
                if (typeof ip !== 'string') throw Error('ip must be a string')
                if (ip.trim() === '') throw Error('Empty ip')
                if (!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) throw Error('invalid ip')
                if (typeof port !== 'string') throw Error('port must be a string')
                if (!(port = port.trim()).length) throw Error('port is empty or blank')
                if (typeof userId !== 'string') throw Error('userId is not a string')

                if (!(userId = userId.trim()).length) throw Error('userId is empty or blank')

                return User.findByIdAndUpdate(userId, { $push: { arduinos: { ip, port } } }, { new: true })
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        return user.arduinos[user.arduinos.length - 1].id
                    })
            })
    },

    /**
     * Retrieves id, ip and port of a specific arduino.
     * 
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * 
     * @returns {Promise<object>}
     */

    retrieveArduino(userId, arduId) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('arduId is not a string')

                if (!(arduId = arduId.trim())) throw Error('arduId is empty or blank')

                return User.findById(userId)
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        const ardu = user.arduinos.id(arduId)

                        if (!ardu) throw Error(`no arduino found with id ${arduId}`)

                        const { id, ip, port } = ardu

                        return { id, ip, port }
                    })
            })
    },

    /**
     * Lists the data of all the arduinos of a user.
     * 
     * @param {string} userId 
     * 
     * @returns {Promise<object>}
     */

    listArduinos(userId) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                return User.findById(userId)
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        return user.arduinos.map(({ id, ip, port }) => ({ id, ip, port }))
                    })
            })
    },

    /**
     * Removes an arduino from a user.
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * 
     * @returns {Promise<boolean>}
     */

    removeArduino(userId, arduId) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('arduino id is not a string')

                if (!(arduId = arduId.trim())) throw Error('arduino id is empty or blank')

                return User.findById(userId)
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        const ardu = user.arduinos.id(arduId)

                        if (!ardu) throw Error(`no arduino found with id ${arduId}`)

                        ardu.remove()

                        return user.save()
                    })
                    .then(() => true)
            })
    },

    /**
     * Updates ip and port from an arduino.
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * @param {string} ip
     * @param {string} port
     * 
     * @returns {Promise<boolean>}
     */

    updateArduino(userId, arduId, ip, port) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('arduino id is not a string')

                if (!(arduId = arduId.trim())) throw Error('arduino id is empty or blank')

                if (typeof ip !== 'string') throw Error('ip is not a string')

                if ((ip = ip.trim()).length === 0) throw Error('ip is empty or blank')

                if (typeof port !== 'string') throw Error('port is not a string')

                if (!(port = port.trim())) throw Error('port is empty or blank')

                return User.findById(userId)
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        const ardu = user.arduinos.id(arduId)

                        if (!ardu) throw Error(`no arduino found with id ${arduId}`)

                        ardu.ip = ip

                        ardu.port = port

                        return user.save()
                    })
                    .then(() => true)
            })
    },

    /**
     * 
     * Filters arduinos by substring of an ip.
     * 
     * @param {string} userId 
     * @param {string} chunk 
     * 
     * @returns {Promise<object>}
     */

    findArduinos(userId, chunk) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof chunk !== 'string') throw Error('chunk is not a string')

                if (!chunk.length) throw Error('chunk is empty')

                return User.findById(userId)
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        return user.arduinos.filter(arduino => arduino.ip.includes(chunk)).map(({ id, ip, port }) => ({ id, ip, port }))
                    })
            })
    },

    /**
     * 
     * Adds data of a specific arduino to the database. Timestamp and value.
     * 
     * @param {string} id 
     * @param {string} arduId 
     * @param {string} value
     * 
     * @returns {Promise<string>}
     */
    addArduinoData(id, arduId, value) {

        return Promise.resolve()
            .then(() => {
                if (typeof value !== 'number') throw Error('value must be a number')
                if (typeof arduId !== 'string') throw Error('arduId is not a string')

                if (!(arduId = arduId.trim()).length) throw Error('arduId is empty or blank')
                return User.findById(id)
                    .then(user => {
                        const data = new ArduinoData({ timestamp: Date.now(), value })
                        const index = user.arduinos.findIndex(ardu => ardu.id === arduId)

                        if (index === -1) throw Error(`no arduino found with id ${arduId}`)

                        user.arduinos[index].data.push(data)
                        return user.save()
                            .then(user =>
                                user.arduinos[index].data[user.arduinos[index].data.length - 1].id
                            )
                    })
            })
    },

    /**
     * 
     * Retrieves all the data of a specific arduino.
     * 
     * @param {string} id 
     * @param {string} arduId 
     * 
     * @returns {Promise<array>}
     */

    retrieveArduinoData(id, arduId) {
        return Promise.resolve()
            .then(() => {
                if (typeof arduId !== 'string') throw Error('arduId is not a string')

                if (!(arduId = arduId.trim())) throw Error('arduId is empty or blank')

                return User.findById(id)
                    .then(user => {
                        const index = user.arduinos.findIndex(ardu => ardu.id === arduId)

                        if (index === -1) throw Error(`No user with arduino ${arduId}`)

                        return user.arduinos[index].data
                    })
            })
    },
    /**
     * 
     * Calls the arduino API to control the stream of data to the database.
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * @param {string} q
     * @param {string} ip
     * 
     * @returns {Promise<object>}
     */

    controlArduino(userId, arduId, q, ip) {
        return Promise.resolve()
            .then(() => {
                if (typeof arduId !== 'string') throw Error('arduId is not a string')

                if (typeof userId !== 'string') throw Error('userId is not a string')

                if (typeof q !== 'string') throw Error('query is not a string')

                if (q !== 'on' && q !== 'off') throw Error('Query can only be ON or OFF.')

                if (typeof ip !== 'string') throw Error('ip is not a string')


                let dataPackage = {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }
                return fetch(`http://${ip}/${userId}/${arduId}/${q}`, dataPackage)
                    .then((res) => res.json())
                    .catch(err => err.message)

            })
    },

    /**
     * 
     * Calls the arduino API to open or close specific pins.
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * @param {string} q
     * @param {string} ip
     * @param {string} pin
     * 
     * @returns {Promise<object>}
     */

    sendOutput(userId, arduId, q, ip, pin) {
        return Promise.resolve()
            .then(() => {
                if (typeof arduId !== 'string') throw Error('arduId is not a string')

                if (typeof userId !== 'string') throw Error('userId is not a string')

                if (typeof q !== 'string') throw Error('query is not a string')

                if (q !== 'on' && q !== 'off') throw Error('Query can only be ON or OFF.')

                if (typeof ip !== 'string') throw Error('ip is not a string')

                if (typeof pin !== 'string') throw Error('pin is not a string')


                let dataPackage = {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }
                return fetch(`http://${ip}/${userId}/${arduId}/pin/${pin}/${q}`, dataPackage)
                    .then((res) => res.json())
                    .catch(err => err.message)

            })
    },
    /**
     * 
     * Removes all of an arduino data stored in the database.
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * 
     * @returns {Promise<boolean>}
     */

    removeArduinoData(userId, arduId) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('arduino id is not a string')

                if (!(arduId = arduId.trim())) throw Error('arduino id is empty or blank')

                return User.findById(userId)
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        const ardu = user.arduinos.id(arduId)

                        if (!ardu) throw Error(`no arduino found with id ${arduId}`)

                        ardu.data = [];

                        return user.save()
                    })
                    .then(() => true)
            })
    }

}

module.exports = logic