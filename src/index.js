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

const { generateMessage, generateLocationMessage } = require('./utils/messages')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New Connection')



    socket.on('join', ({ username, room}, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            username: username,
            room: room
        })

        // Send error if username exists in room
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} is here!`))

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Dont use profanity')
        }

        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left the chat`))

        }

    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

        callback()
    })
})

server.listen(port, () => {
    console.log(`Server is up. Check port ${port}!`)
})

