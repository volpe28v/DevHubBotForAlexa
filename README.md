DevHubBotForGoogleHome
==========

DevHubとGoogleHomeを接続してDevHubからの発言をGoogleHomeに喋らせるボットです。
ローカルでは google-home-notifier をサーバとして起動しておく想定。

Usage
----

例：
 * DevHub : 192.168.1.5:3000 Basic認証 user/pass
 * google-home-notifier: 192.168.1.6:8091
の場合、下記のようにする。

```
$ git clone https://github.com/volpe28v/DevHubBotForGoogleHome/
$ cd DevHubBotForGoogleHome
$ npm install
```

```
DEVHUB=http://user:pass@192.168.1.5:3000/ GOOGLE_HOME=http://192.168.1.6:8091/ node app.js
```
