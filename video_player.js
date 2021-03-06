var Omx = require('node-omxplayer');
var fs = require('fs');
var path = require('path');
var video_dir = './videos/';
var player = null;

module.exports.play_suffle = function(play_handler){
  fs.readdir(video_dir, function(err, files){
    if (err) throw err;
    files = shuffle(files).map(function(file){ return video_dir + file;});
    console.log(files);

    if (player != null){
      player.quit();
      return;
    }else{
      play_head_in_files(files, play_handler);
    }
  });
}

module.exports.stop = function(play_handler){
  if (player != null){
    player.quit();
    player = null;
  }
}

function play_head_in_files(files, play_handler){
  if (files.length == 0) return;

  var file = files.shift();
  files.push(file);

  player = Omx(file, 'both');
  play_handler('Now playing: ' + path.basename(file));

  player.on('close', function(){
    if (player == null) return;

    play_head_in_files(files, play_handler);
  });
}

function shuffle(array){
  for(var i = array.length - 1; i > 0; i--){
    var r = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }

  return array;
}
