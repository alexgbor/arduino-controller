'use strict'

const arduApi = require('api')

arduApi.url = 'http://192.168.0.46:5000/api'
//arduApi.url = 'https://immense-atoll-60872.herokuapp.com/api'

const logic = {
    userId: 'NO-ID',

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
        return arduApi.registerUser(name, surname, email, password)
            .then(data => data)
            .catch(err => err.message)
    },
    /**
     * 
     * Allows you to retrieve a userId of a user.
     * 
     * @param {string} email 
     * @param {string} password 
     * 
     * @returns {string}
     */
    login(email, password) {
        return arduApi.authenticateUser(email, password)
            .then(data => {
                this.userId = data.data.id

                return data
            })
            .catch(err => err.message)

    },
    /**
     * 
     * Retrieves the non sensitive information of a user.
     * 
     * @param {string} id
     * @param {string} token
     * 
     * @returns {string} 
     */

    retrieveUser(userId, token) {
        arduApi.token = token
        return arduApi.retrieveUser(userId).then(data => data).catch(err => err.message)
    },
    /**
     * 
     * Updates the picture_url, email and password.
     * 
     * @param {string} id 
     * @param {string} token
     * @param {string} name 
     * @param {string} surname 
     * @param {string} email 
     * @param {string} password 
     * @param {string} picture_url
     * @param {string} newEmail 
     * @param {string} newPassword 
     * 
     * @returns {String}
     */
    updateUser(id, token, name, surname, password, email, picture_url) {
        arduApi.token = token
        return arduApi.updateUser(id, name, surname, email, password, picture_url, email, password)
            .then(data => data).catch(err => err.message)
    },
    /**
     * Removes a user from the database.
     * 
     * @param {string} id 
     * @param {string} token
     * @param {string} email 
     * @param {string} password 
     * 
     * @returns {string}
     */
    unregisterUser(email, password, token, id) {
        arduApi.token = token

        return arduApi.unregisterUser(id, email, password)
            .then(data => data).catch(err => err.message)
    },
    /**
     * 
     * Adds an arduino attached to a user.
     * 
     * @param {string} userId 
     * @param {string} ip 
     * @param {string} port 
     * 
     * @returns {string}
     */
    addArduino(userId, ip, port) {
        return arduApi.addArduino(userId, ip, port)
            .then(data => data).catch(err => err.message)
    },
    /**
     * Lists the data of all the arduinos of a user.
     * 
     * @param {string} userId
     * @param {string} token 
     * 
     * @returns {string}
     */
    listArduinos(userId, token) {
        arduApi.token = token
        return arduApi.listArduinos(userId)
            .then(data => data).catch(err => err.message)
    },
    /**
     * Removes an arduino from a user.
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * @param {string} token
     * 
     * @returns {boolean}
     */
    removeArduino(userId, arduId, token) {
        arduApi.token = token
        return arduApi.removeArduino(userId, arduId)
    },
    /**
     * 
     * Adds data of a specific arduino to the database. Timestamp and value.
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * @param {string} value
     * 
     * @returns {Promise<string>}
     */
    addArduinoData(userId, arduId, value) {
        return arduApi.addArduinoData(userId, arduId, value)
    },
    /**
     * 
     * Retrieves all the data of a specific arduino.
     * 
     * @param {string} userId 
     * @param {string} arduId 
     * @param {string} token
     * 
     * @returns {string}
     */

    retrieveArduinoData(userId, arduId, token) {
        arduApi.token = token
        return arduApi.retrieveArduinoData(userId, arduId, token)
            .then(data => data).catch(err => err.message)
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
     * @returns {string}
     */

    controlArduino(userId, arduId, q, ip) {
        return arduApi.controlArduino(userId, arduId, q, ip)
    },

    removeArduinoData(userId, arduId) {
        return arduApi.removeArduinoData(userId, arduId)
            .then(data => data).catch(err => err.message)
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
     * @returns {string}
     */
    sendOutput(userId, arduId, q, ip, pin) {
        return arduApi.sendOutput(userId, arduId, q, ip, pin)
    },
    /**
     * 
     * Returns csv file with the arduino data.
     * 
     * @param {object} args 
     * 
     * @returns {file}
     */
    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    },

    /**
     * 
     * Returns a csv file with your arduino data.
     * 
     * @param {object} args
     * @param {array} arr
     * 
     * @returns {file}
     */

    downloadCSV(args, arr) {
        var data, filename, link;
        var csv = this.convertArrayOfObjectsToCSV({
            data: arr
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
}

export default logic