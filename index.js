//  index.js
//  VoltIO
//
//  Created by Marat on 10.10.16.
//  Copyright © 2016 Favio Mobile. All rights reserved.

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 55011;//process.env.PORT || 5000;

server.listen(port, function () {
  console.log('VoltIO listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  console.log('Client connected');
  socket.on('subscribe', function (channel) {
    console.log('Client subscribed to "%s"', channel);
    // we store the channel in the socket session for this client
    socket.channel = channel
    // and join socket to the room with channel name
    socket.join(channel)
  });

  socket.on('default', function (data) {
    // if channel exists, send to its room
    if (socket.channel) {
      socket.to(socket.channel).emit('default', data);
      console.log('Message sent to room "%s"', socket.channel);
    } else { // otherwise send broadcast
      socket.broadcast.emit('default', data);
      console.log('Message broadcasted');
    }
  });

  socket.on('disconnect', function () {
    console.log('Client dicconnected');
  });
});
