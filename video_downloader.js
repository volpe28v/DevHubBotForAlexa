var fs = require('fs');
var youtubedl = require('youtube-dl');
var video_dir = './videos/';

var youtube_uri = null;
var file_name = 'video.mp4';

var qualities = [
  { reso: '1080p', value: 137 },
  { reso: '720p',  value: 136 },
  { reso: '480p',  value: 135 }
];

module.exports.download = function(youtube_uri, file_name, reso, handler){
  console.log("uri: " + youtube_uri);
  console.log("file_name: " + file_name);
  console.log("reso: " + reso);

  var quality = qualities.filter(function(q){ return q.reso == reso; })[0];
  if (quality == null) quality = qualities[0];

  console.log("quality: " + quality.value);

  var video = youtubedl(youtube_uri,
    ['--format=' + quality.value],
    { cwd: __dirname });

  handler('Try to download..');
  console.log('Getting information..');

  video.on('error', function error(err) {
    handler('Error Downloading: ' + err.message);
  });

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
      handler('Complete to Download: ' + info._filename);
    });
  });
}


