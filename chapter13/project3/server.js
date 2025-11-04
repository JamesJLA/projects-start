// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat-adv-client.html'));
});

let users = []; // store { id, name, picId }

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // When a new user joins
  socket.on('new-user', (username) => {
    const picId = Math.floor(Math.random() * 70) + 1;
    const newUser = { id: socket.id, name: username, picId };
    users.push(newUser);

    // Inform all clients
    io.emit('user-joined', { users, newUser });
  });

  // When a user sends a message
  socket.on('send-message', (data) => {
    socket.broadcast.emit('receive-message', data);
  });

  // When user leaves voluntarily
  socket.on('user-leave', (username) => {
    users = users.filter(u => u.name !== username);
    io.emit('user-left', { users, username });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      users = users.filter(u => u.id !== socket.id);
      io.emit('user-left', { users, username: user.name });
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
