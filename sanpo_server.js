var request = require('request');
var fs = require('fs');
var path = require('path');

var downloader = require('./video_downloader');
var CronJob = require('cron').CronJob;

var googleApiKey = process.env.GOOGLE_API_KEY;
var youtubeUrl = 'https://www.youtube.com/watch?v=';
var keyword = encodeURIComponent("ドリ散歩");
var channelId = 'UCTfta7Ult6yLu7ru-WInOGg';
var maxNum = 5;
var getListURI = `https://www.googleapis.com/youtube/v3/search?key=${googleApiKey}&type=video&q=${keyword}&part=snippet&maxResults=${maxNum}&order=date&channelId=${channelId}`

function SanpoServer(dir){
  var self = this;
  this.dir = dir;

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
            savePath: self.dir + item.id.videoId + '.mp4'
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
    var deleteList = fs.readdirSync(self.dir)
      .filter(function(file){
        return path.extname(self.dir + file) == ".mp4";
      })
      .map(function(file){
        return {
          filename: self.dir + file,
          mtime: fs.statSync(self.dir + file).mtime
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
