const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const leaveRoom = document.getElementById('leave-btn')

// get username from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io()

// join chatroom
socket.emit('joinRooom', { username, room })

// get room and users
socket.on('roomUsers', ({ room, users }) => {
  console.log(users)
  outputRoomName(room);
  outputUsers(users)
})

// messages from server
socket.on('message', message => {
  console.log(message)
  outputMessage(message)

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// message submit
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const msg = event.target.elements.msg.value

  //emit message to server
  socket.emit('chatMessage', msg)

  // clear input
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
})

// leave room 
leaveRoom.addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
})


// output message to dom
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div)
}

// add roomName to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

// add userList to dom
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.name}</li>`).join('')}
  `
}