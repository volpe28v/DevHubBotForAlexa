var fs = require('fs');
var youtubedl = require('youtube-dl');
var video_dir = './videos/';

var youtube_uri = null;
var file_name = 'video.mp4';
var quality = 137; // 1080p

module.exports.download = function(youtube_uri, file_name, handler){
  console.log("uri: " + youtube_uri);
  console.log("file_name: " + file_name);
  console.log("quality: " + quality);

  var video = youtubedl(youtube_uri,
    ['--format=' + quality],
    { cwd: __dirname });

  console.log('Getting information..');

  var size = 0;
  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);

    size = info.size;
    video.pipe(fs.createWriteStream(video_dir + file_name));

    handler('Now downloading: ' + info._filename);

    var pos = 0;
    video.on('data', function data(chunk) {
      pos += chunk.length;
      if (size) {
        var percent = (pos / size * 100).toFixed(2);
        process.stdout.cursorTo(0);
        process.stdout.clearLine(1);
        process.stdout.write(percent + '%');
      }
    });

    video.on('end', function(){
      console.log('');
      console.log('Download end');
      handler('Downloaded: ' + info._filename);
    });
  });
}


