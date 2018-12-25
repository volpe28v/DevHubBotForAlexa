var io = require('socket.io-client');
var player = require('./video_player');
var downloader = require('./video_downloader');


var devhub_url = process.env.DEVHUB;
var name = 'Alexa';
var video_dir = './videos/';

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

    if (data.msg.match(/video/i)){
      player.play_suffle(function(msg){
        socket.emit('message',{name: name, room_id: 1, msg: msg});
      });
    }else if (data.msg.match(/stop/i)){
      player.stop();
    }else if (data.msg.match(/youtube\.com\/watch/i)){
      downloader.download(
        data.msg.split(" ")[1],
        data.msg.split(" ")[2],
        video_dir + data.msg.split(" ")[3],
        function(msg){
          socket.emit('message',{name: name, room_id: 1, msg: msg});
        }
      );
    }
  }
});
socket.on('disconnect', function(){});
