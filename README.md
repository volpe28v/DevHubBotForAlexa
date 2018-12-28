DevHubBotForAlexa
==========

Alexa 経由で IFTTT からの DevHub への通知を解釈するボットです。
ローカルのラズパイ上で動かして映像を流したりするのに使う想定。

(実はDevHubまで通知するのが Alexa (IFTTT経由)というだけで、このボットは特に Alexa に依存していない)

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
GOOGLE_API_KEY=XXXXXXX DEVHUB=http://user:pass@192.168.1.5:3000/ node app.js
```

出来ること
----
* ラズパイ上で動画を流す (@Alexsa video)
* Youtube動画をダウンロードする (@Alexsa https://www.youtube.com/watch?v=xxxxxxxx video_name)
* ドリ散歩の最新の10件のYoutube動画を自動ダウンロードする (or @Alexsa sanpo)

システム構成
----
![システム構成](https://user-images.githubusercontent.com/754962/50521466-3434d680-0b09-11e9-81cc-d9dafc9bd759.png)
