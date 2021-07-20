const express = require('express')
const path = require('path')
const http = require('http')

const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

const Filter = require('bad-words')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New Connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has entered the chat!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Dont use profanity')
        }

        io.emit('message', message)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)

        callback()
    })
})

server.listen(port, () => {
    console.log(`Server is up. Check port ${port}!`)
})

