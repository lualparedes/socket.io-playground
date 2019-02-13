const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('messagesent', (data) => {
    console.log(`A message was sent: ${data}`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
