// users functions
const users = [];

// user joins chat (create a user)
function joinUser(id, username, room) {
  const user = {
    id,
    username,
    room,
  };

  users.push(user);

  return user;
}

// get current User by id
function getCurrentUser(id) {
  const user = users.find((user) => user.id === id);
  return user;
}

// delete user by id
function userLeaves(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// get room users
function getRoomUsers(room) {
  const userRoom = users.filter((user) => user.room === room);
  return userRoom;
}

module.exports = {
  getCurrentUser,
  joinUser,
  getRoomUsers,
  userLeaves,
};
