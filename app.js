var io = require('socket.io-client');

var devhub_url = process.env.DEVHUB;
var name = 'Alexa';

var socket = io.connect(devhub_url);
socket.on('connect', function(){
  console.log("connect: " + devhub_url);
  socket.emit('name', {name: name});
});

socket.on('message', function(data){
  var command = "";
  console.log(data);
  if (data.msg.match(/@Alexa/i)){
    console.log(data.msg);

  }
});
socket.on('disconnect', function(){});
