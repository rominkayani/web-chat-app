const users = []
const rooms = []

const addUser = ({ id, username, room}) => {
    // Cleaning up the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Check if username and room is provided
    if (!username || !room){
        return {
            error: 'Please enter a username and room'
        }
    }

    // Check if username provided is taken for a specific room
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: "Username is used"
        }
    }

    // Tracking room
    const existingRoom = rooms.find((currentroom) => {
        return currentroom.room === room
    })

    if (existingRoom) {
        existingRoom.membercount = existingRoom.membercount + 1
    } else {
        const membercount = 1;
        const newroom = { room, membercount}
        rooms.push(newroom)
    }

    // Storing the user
    const user = { id, username, room}
    users.push(user)
    return { user }

}

const removeUser = (id) => {
    // Finding user based on ID
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
    // Removes item from array by index
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    // Finding user based on ID
    return users.find((user) => {
        return user.id === id
    })

}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    // Keeps all users where users room equals the room we are looking for
    return users.filter((user) => {
        return user.room === room
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    rooms
}