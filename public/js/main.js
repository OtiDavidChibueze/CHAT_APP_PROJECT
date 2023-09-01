// main File
const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userLists = document.getElementById("users");

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// join room
socket.emit("joinRoom", { username, room });

// room name and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUserLists(users);
});

// listen for a connection message
socket.on("message", (message) => {
  // getting the output message
  outputMessage(message);

  // assigning the chat message scroll top to the scroll height
  chatMessage.scrollTop = chatMessage.scrollHeight;

  // add event listener for the submit button
  chatForm.addEventListener("submit", (e) => {
    // prevent it from submitting
    e.preventDefault();

    // getting the msg from the chat from
    const msg = e.target.elements.msg.value;

    socket.emit("chatMessage", msg);

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
  });
});

// output message function
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `	<p class="meta">${message.username} <span> ${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// output room name function
function outputRoomName(room) {
  roomName.innerHTML = room;
}

// output room users function
function outputUserLists(users) {
  userLists.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
