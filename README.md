DevHubBotForAlexa
==========

Alexa 経由で IFTTT からの DevHub への通知を解釈するボットです。
ローカルのラズパイで映像を流したりするのに使う想定。

Usage
----

例：
 * DevHub : 192.168.1.5:3000 Basic認証 user/pass
の場合、下記のようにする。

```
$ git clone https://github.com/volpe28v/DevHubBotForAlexa/
$ cd DevHubBotForAlexa
$ npm install
```

```
DEVHUB=http://user:pass@192.168.1.5:3000/ node app.js
```

出来ること
----
* ラズパイ上で動画を流す (video コマンド)
