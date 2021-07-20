const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

const form = document.getElementById('form');

// document.querySelector('#message').addEventListener('submit', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })

form.addEventListener('submit', () => {
    console.log('Clicked')
})