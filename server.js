const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 3000
const path = require('path')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')
const userName = 'Ronny1'

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// run when client connects
io.on('connection', socket => {
  socket.on('joinRooom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room)
    console.log('new connect')
    socket.emit('message', formatMessage(userName, 'welcome to chatroom'))

    // broadcast when a user connect
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(userName, `${user.name} has joined this room `))

    // send users and room info
    io
      .to(user.room)
      .emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
  })

  // listen for chat message
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id)
    io
      .to(user.room)
      .emit('message', formatMessage(user.name, msg))
  })

  //run when client disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    if (user) {
      io
        .to(user.room)
        .emit('message', formatMessage(userName, `${user.name} has left this room`));

      // send users and room info
      io
        .to(user.room)
        .emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        })
    }
  })

})



server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
}); 