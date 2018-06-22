'use strict'

const axios = require('axios')

const arduApi = {
    url: 'NO-URL',

    token: 'NO-TOKEN',

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

                return axios.post(`${this.url}/users`, { name, surname, email, password })
                    .then(({ status, data }) => {
                        if (status !== 201 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
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

                return axios.post(`${this.url}/auth`, { email, password })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        const { data: { id, token } } = data

                        this.token = token

                        return data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
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

                return axios.get(`${this.url}/users/${id}`, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)
                        return data.data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
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

                return axios.patch(`${this.url}/users/${id}`, { name, surname, email, password, picture_url, newEmail, newPassword }, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * 
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

                return axios.delete(`${this.url}/users/${id}`, { headers: { authorization: `Bearer ${this.token}` }, data: { email, password } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return true
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * Adds an arduino attached to a user.
     * 
     * @param {string} userId
     * @param {string} text 
     * 
     * @returns {Promise<string>}
     */
    addArduino(userId, ip, port) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof ip !== 'string') throw Error('ip is not a string')

                if ((ip = ip.trim()).length === 0) throw Error('ip is empty or blank')

                return axios.post(`${this.url}/users/${userId}/arduinos`, { ip, port }, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 201 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data.id
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * Retrieves id, ip and port of a specific arduino.
     * 
     * @param {string} userId
     * @param {string} noteId 
     * 
     * @returns {Promise<Arduino>}
     */
    retrieveArduino(userId, arduId) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('ardu id is not a string')

                if (!(arduId = arduId.trim())) throw Error('ardu id is empty or blank')

                return axios.get(`${this.url}/users/${userId}/arduinos/${arduId}`, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * Lists the data of all the arduinos of a user.
     * 
     * @param {string} userId
     * 
     * @returns {Promise<[Arduino]>}
     */
    listArduinos(userId) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                return axios.get(`${this.url}/users/${userId}/arduinos`, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * Updates ip and port from an arduino.
     * 
     * @param {string} userId
     * @param {string} noteId 
     * @param {string} text 
     * 
     * @returns {Promise<boolean>}
     */
    updateArduino(userId, arduId, ip, port) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('note id is not a string')

                if (!(arduId = arduId.trim())) throw Error('note id is empty or blank')

                if (typeof ip !== 'string') throw Error('ip is not a string')

                if ((ip = ip.trim()).length === 0) throw Error('ip is empty or blank')

                return axios.patch(`${this.url}/users/${userId}/arduinos/${arduId}`, { ip, port }, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return true
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * Removes an arduino from a user.
     * 
     * @param {string} userId
     * @param {string} noteId 
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

                return axios.delete(`${this.url}/users/${userId}/arduinos/${arduId}`, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return true
                    })
                    .catch(err => {

                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * Filters arduinos by substring of an ip.
     * 
     * @param {string} userId
     * @param {string} text 
     * 
     * @returns {Promise<[Note]>}
     */
    findArduinos(userId, chunk) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof chunk !== 'string') throw Error('chunk is not a string')

                if (!chunk.length) throw Error('chunk is empty')

                return axios.get(`${this.url}/users/${userId}/arduinos?q=${chunk}`, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * Adds data of a specific arduino to the database. Timestamp and value.
     * 
     * @param {string} userId
     * @param {string} text 
     * 
     * @returns {Promise<string>}
     */
    addArduinoData(userId, arduId, value) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('arduId is not a string')

                if ((arduId = arduId.trim()).length === 0) throw Error('arduId is empty or blank')

                return axios.post(`${this.url}/users/${userId}/arduinos/${arduId}/data`, { value })
                    .then(({ status, data }) => {
                        if (status !== 201 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data.id
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    },

    /**
     * Retrieves all the data of a specific arduino.
     * 
     * @param {string} userId
     * @param {string} noteId 
     * 
     * @returns {Promise<ArduinoData>}
     */
    retrieveArduinoData(userId, arduId, token) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('ardu id is not a string')

                if (!(arduId = arduId.trim())) throw Error('ardu id is empty or blank')

                return axios.get(`${this.url}/users/${userId}/arduinos/${arduId}/data`, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
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
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('arduId is not a string')

                if (!arduId.length) throw Error('arduId is empty')

                if (typeof q !== 'string') throw Error('query is not a string')

                if (typeof ip !== 'string') throw Error('ip is not a string')


                if (q !== 'on' && q !== 'off') throw Error('query must be "on" or "off"')

                return axios.get(`${this.url}/users/${userId}/arduinos/${arduId}/control?q=${q}&ip=${ip}`)
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return true
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
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

                return axios.delete(`${this.url}/users/${userId}/arduinos/${arduId}/delete`)
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return true
                    })
                    .catch(err => {

                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
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
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof arduId !== 'string') throw Error('arduId is not a string')

                if (!arduId.length) throw Error('arduId is empty')

                if (typeof q !== 'string') throw Error('query is not a string')

                if (typeof ip !== 'string') throw Error('ip is not a string')

                if (typeof pin !== 'string') throw Error('pin is not a string')

                if (q !== 'on' && q !== 'off') throw Error('query must be "on" or "off"')

                return axios.get(`${this.url}/users/${userId}/arduinos/${arduId}/control/pin?q=${q}&ip=${ip}&pin=${pin}`)
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return true
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            return message
                        } else return err
                    })
            })
    }
}

module.exports = arduApi