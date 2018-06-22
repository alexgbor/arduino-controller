const express = require('express')
const bodyParser = require('body-parser')
const logic = require('logic')
const jwt = require('jsonwebtoken')
const jwtValidation = require('./utils/jwt-validation')

const router = express.Router()

const { env: { TOKEN_SECRET, TOKEN_EXP } } = process

const jwtValidator = jwtValidation(TOKEN_SECRET)

const jsonBodyParser = bodyParser.json()

router.post('/users', jsonBodyParser, (req, res) => {
    const { body: { name, surname, email, password } } = req

    logic.registerUser(name, surname, email, password)
        .then(() => {
            res.status(201)
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.post('/auth', jsonBodyParser, (req, res) => {
    const { body: { email, password } } = req

    logic.authenticateUser(email, password)
        .then(id => {
            const token = jwt.sign({ id }, TOKEN_SECRET, { expiresIn: TOKEN_EXP })

            res.status(200)
            res.json({ status: 'OK', data: { id, token } })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId', jwtValidator, (req, res) => {
    const { params: { userId } } = req

    return logic.retrieveUser(userId)
        .then(user => {
            res.status(200)
            res.json({ status: 'OK', data: user })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })

})

router.patch('/users/:userId', [jwtValidator, jsonBodyParser], (req, res) => {
    const { params: { userId }, body: { name, surname, email, password, picture_url, newEmail, newPassword } } = req

    logic.updateUser(userId, name, surname, email, password, picture_url, email, password)
        .then(() => {
            res.status(200)
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.delete('/users/:userId', [jwtValidator, jsonBodyParser], (req, res) => {
    const { params: { userId }, body: { email, password } } = req

    logic.unregisterUser(userId, email, password)
        .then(() => {
            res.status(200)
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.post('/users/:userId/arduinos', [jwtValidator, jsonBodyParser], (req, res) => {
    const { params: { userId }, body: { ip, port } } = req

    logic.addArduino(userId, ip, port)
        .then(id => {
            res.status(201)
            res.json({ status: 'OK', data: { id } })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId/arduinos/:arduId', jwtValidator, (req, res) => {
    const { params: { userId, arduId } } = req

    logic.retrieveArduino(userId, arduId)
        .then(arduino => {
            res.json({ status: 'OK', data: arduino })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId/arduinos', jwtValidator, (req, res) => {
    const { params: { userId }, query: { q } } = req;

    (q ? logic.findArduinos(userId, q) : logic.listArduinos(userId))
        .then(arduinos => {
            res.json({ status: 'OK', data: arduinos })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })

})

router.delete('/users/:userId/arduinos/:arduId', jwtValidator, (req, res) => {
    const { params: { userId, arduId } } = req

    logic.removeArduino(userId, arduId)
        .then(() => {
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.patch('/users/:userId/arduinos/:arduId', [jwtValidator, jsonBodyParser], (req, res) => {
    const { params: { userId, arduId }, body: { ip, port } } = req

    logic.updateArduino(userId, arduId, ip, port)
        .then(() => {
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.post('/users/:userId/arduinos/:arduId/data', jsonBodyParser, (req, res) => {
    const { params: { userId, arduId }, body: { value } } = req

    logic.addArduinoData(userId, arduId, value)
        .then(id => {
            res.status(201)
            res.json({ status: 'OK', data: { id } })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId/arduinos/:arduId/data/', jwtValidator, (req, res) => {
    const { params: { userId, arduId } } = req

    logic.retrieveArduinoData(userId, arduId)
        .then(data => {
            res.json({ status: 'OK', data })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId/arduinos/:arduId/control', (req, res) => {
    const { params: { userId, arduId }, query: { q, ip } } = req
    if (q === 'on' || q === 'off') {
        logic.controlArduino(userId, arduId, q, ip)
            .then(({ stat }) => res.json({ status: 'OK', data: stat }))
            .catch(({ message }) => {
                res.status(400)
                res.json({ status: 'KO', error: message })
            })
    }
})

router.delete('/users/:userId/arduinos/:arduId/delete', (req, res) => {
    const { params: { userId, arduId } } = req

    logic.removeArduinoData(userId, arduId)
        .then(() => {
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId/arduinos/:arduId/control/pin', (req, res) => {
    const { params: { userId, arduId }, query: { q, ip, pin } } = req
    if (q === 'on' || q === 'off') {
        logic.sendOutput(userId, arduId, q, ip, pin)
            .then(({ stat }) => res.json({ status: 'OK', data: stat }))
            .catch(({ message }) => {
                res.status(400)
                res.json({ status: 'KO', error: message })
            })
    }
})

module.exports = router