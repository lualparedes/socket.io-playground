const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



io.on('connection', (socket) => {

  console.log('A user connected');


  // Room management
  const numOfConnectedClients = Object.keys(io.of('/').sockets).length;

  if (numOfConnectedClients <= 2) {
    console.log(`someone joined, now we're ${numOfConnectedClients}`);
    socket.join('my-awesome-default-room', () => {
      console.log(`${numOfConnectedClients} in my-awesome-default-room`);
    });
  }
  else {
    console.log(`TOO MANY PEOPLE!, now we're ${numOfConnectedClients}`);
    socket.join('rejection-room', () => {
      console.log(`User couldn't get into my-awesome-default-room`);
    });
  }

  io.of('/').in('my-awesome-default-room').emit('accept');
  io.of('/').in('rejection-room').emit('reject');


  // Regular event management
  socket.on('messagesent', (data) => {
    console.log(`A message was sent: ${data.message}`);
    if (data.room == 'my-awesome-default-room') {
      io.of('/').in(data.room).emit('newmessage', data.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});
