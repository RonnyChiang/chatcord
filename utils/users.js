const users = []

// join user to chatroom
function userJoin(id, name, room) {
  const user = { id, name, room };
  users.push(user);
  return user
}

//get current user 
function getCurrentUser(id) {
  return users.find(user => user.id === id)
}

// user leave
function userLeave(id) {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    const user = users[index]
    users.splice(index, 1);
    return user
  }
}

// get roomusers 
function getRoomUsers(room) {
  return users.filter(user => user.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
}