document.addEventListener("DOMContentLoaded", function () {

  const socket = io(); // connect to server

  // get user name and then tell the server
  let username = prompt('What\'s your username?');  
  if (!username || username.trim() === "") {
    alert("Username is required!");
    window.location.reload();
  }
  socket.emit('new-user', username);


  /* This user is sending a new chat message */
  document.querySelector("#chatForm").addEventListener('submit', e => {
    e.preventDefault();
    const entry = document.querySelector("#entry");
    const message = entry.value.trim();
    if (message === "") return;

    const time = new Date().toLocaleTimeString();

    // show message locally
    addMessage(`${username}: ${message} (${time})`, 'message-sent');

    // send to server
    socket.emit('send-message', { name: username, message, time });

    entry.value = '';
  });


  /* User has clicked the leave button */
  document.querySelector("#leave").addEventListener('click', e => {
    e.preventDefault();

    socket.emit('user-leave', username);
    addMessage('You left the chat.', 'message-user');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });  



  /* ===== Server Events ===== */

  socket.on('user-joined', ({ users, newUser }) => {
    addMessage(`${newUser.name} joined the chat.`, 'message-user');
    updateUserList(users);
  });

  socket.on('user-left', ({ users, username }) => {
    addMessage(`${username} left the chat.`, 'message-user');
    updateUserList(users);
  });

  socket.on('receive-message', data => {
    addMessage(`${data.name}: ${data.message} (${data.time})`, 'message-received');
  });



  /* ===== Helper Functions ===== */

  function addMessage(text, className) {
    const messagesList = document.querySelector('.messages-body ul');
    const li = document.createElement('li');
    li.textContent = text;
    li.classList.add(className);
    messagesList.appendChild(li);
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  function updateUserList(users) {
    const usersList = document.querySelector('#users ul');
    usersList.innerHTML = '';
    users.forEach(u => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="https://randomuser.me/api/portraits/men/${u.picId}.jpg"
             width="40" height="40"
             style="border-radius:50%; margin-right:10px;">
        <span>${u.name}</span>
      `;
      usersList.appendChild(li);
    });
  }

});
