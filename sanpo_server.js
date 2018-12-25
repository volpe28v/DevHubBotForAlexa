var request = require('request');
var fs = require('fs');
var path = require('path');

var downloader = require('./video_downloader');
var CronJob = require('cron').CronJob;

var youtubeUrl = 'https://www.youtube.com/watch?v=';
var keyword = encodeURIComponent("ドリ散歩");
var channelId = 'UCTfta7Ult6yLu7ru-WInOGg';
var maxNum = 5;
var getListURI = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyASm1rVlmLTo7ojvP5FegeUc0gIXW9_zr4&type=video&q=${keyword}&part=snippet&maxResults=${maxNum}&order=date&channelId=${channelId}`
var dir = './videos/';

function SanpoServer(){
  this.startCron = function(pattern){
    new CronJob({
      cronTime: pattern,
      start: true,
      onTick: function () {
        self.updateSanpo();
      }
    });
  }

  this.updateSanpo = function(){
    Promise.resolve()
    .then(function(){
      return getItemList()
    })
    .then(function(items){
      return downloadItems(items);
    })
    .then(function(result){
      console.log("Complete all downloads");
      deleteOldVideos();
    });
  }

  function getItemList(){
    return new Promise(function(resolve, reject){
      var option = {
        url: getListURI,
        method: 'GET',
        json: true
      };

      request(option, function(e, res, body){
        console.log(body.items);
        var items = body.items.map(function(item){
          return {
            date: item.snippet.publishedAt,
            id: item.id.videoId,
            savePath: dir + item.id.videoId + '.mp4'
          }
        });
        console.log(items);

        if (e == null){
          resolve(items);
        }else{
          reject(e);
        }
      });
    });
  }

  function downloadItems(items){
    var downloads = items.map(function(item){
      if (exist(item.savePath)){
        return Promise.resolve();
      }

      return downloader.download(
        youtubeUrl + item.id,
        item.savePath,
        null,
        function(msg){
          console.log(msg)
        }
      );
    });

    return Promise.all(downloads);
  }

  function deleteOldVideos(){
    var deleteList = fs.readdirSync(dir)
      .filter(function(file){
        return path.extname(dir + file) == ".mp4";
      })
      .map(function(file){
        return {
          filename: dir + file,
          mtime: fs.statSync(dir + file).mtime
        }
      })
      .sort((a,b) => b.mtime - a.mtime)
      .slice(maxNum);

    console.log(deleteList);

    deleteList.forEach(function(file){
      fs.unlink(file.filename, function (err) {
        console.log(`Deleted ${file}`);
      });
    });
  }

  function exist(filePath){
    try{
      // ファイルの存在判定,
      fs.statSync(filePath);
      return true;
    }catch(e){
      return false;
    }
  }
}

module.exports = SanpoServer;
