const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 443
const socketIO = require('socket.io');

const server = express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.render('index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
  

// SOCKET.IO CODE
const io = socketIO(server);

// VARIABLES
let connections = [];
let allPlayers = [];
let correspondence = [];
let rooms = [];

// EVENTS
io.on('connection', function(socket){
  console.log('New connection')
  // NEW CONNECTION APPEARED
  connections.push(socket);
  let gameSteps;
  let playerRoom;
  
  // FIRST PLAYER CONNECTED
  if (connections.length % 2 !== 0){
    rooms.push(
      {roomId: `room-${socket.id}`, 
      playersInRoom: [socket.id], 
      steps:['','','','','','','','','']
    }
  );

  // SECOND PLAYER CONNECTED
  } else {
    rooms[rooms.length-1].playersInRoom.push(socket.id);
  };
  socket.join(rooms[rooms.length-1].roomId);
  console.log(rooms);

  // PLAYER CALLED HIS NAME
  socket.on('my name is', playerName=>{
    allPlayers.push({id: socket.id, name: playerName});
    io.emit('players list', allPlayers); // SEND PLAYERS LIST
    io.emit('send correspondence', correspondence); // SEND ALL MESSAGES
    
    // SEARCH ROOM OF PLAYER BY HIS SOCKET.ID
    for (room in socket.rooms) {
      if (room.indexOf('room') !== -1) playerRoom = room; // SAVE IT IN VARIABLE      
    };

    // ADVERTISE ABOUTE SECOND PLAYER IS IN ROOM
    rooms.forEach(room=>{
      if (room.playersInRoom.length > 1) {
        io.to(playerRoom).emit('second player conncted');
        io.to(room.playersInRoom[0]).emit('you can turn');
      };
    });

  });

  // DISCONNECTION
  socket.on('disconnect', data=>{
    connections.splice(connections.indexOf(socket), 1); // DELETE FROME CONNECTIONS ARREY
    allPlayers.forEach((player, i)=>{
      if (player.id === socket.id)  allPlayers.splice(i, 1);
    })
    console.log('Disconnect');
    rooms.forEach((room, a)=>{
      room.playersInRoom.forEach((player, b) => {
        if (socket.id === player) {
          rooms[a].playersInRoom.splice(b, 1);
          rooms[a].steps = ['','','','','','','','',''];
        };
        if (room.playersInRoom.length === 0) {
          rooms.splice(a, 1);
        };
      });
    });
  });

  // NEW CHAT MESSAGE
  socket.on('send message', (msg, playerName)=>{
    correspondence.unshift(`${playerName}: ${msg}`);
    io.emit('send correspondence', correspondence);
  });


  // NEW TTT TURN 
  socket.on('player make step', cellClass=>{
    console.log('player make step');
    let gameSigne;
    
    rooms.forEach((room, i)=>{
      // SPOT THE PLAYER SIGNE
      if (room.playersInRoom[0] === socket.id) {gameSigne = 'x'}
      else {gameSigne = 'o'};
      // UPDATE STEPS ARRAY WITH NEW STEP WAS MADE
      room.steps.splice(cellClass.slice(-1), 1, gameSigne);
      gameSteps = room.steps;
    })

    console.log(playerRoom);
    io.to(playerRoom).emit('made step', gameSteps, socket.id);
  })

});