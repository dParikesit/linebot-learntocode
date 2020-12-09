'use strict';

const express = require('express')
const line = require('@line/bot-sdk')
const fs = require('fs')
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
const client = new line.Client(config)

const firebase = require('firebase/app')
require('firebase/storage')
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_PROJECT_ID + ".firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_PROJECT_ID + ".appspot.com",
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: "G-" + process.env.FIREBASE_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig)

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    if (!Array.isArray(req.body.events)) {
      return res.status(500).end();
    }
    Promise
      .all(req.body.events.map(event => {
          if (event.replyToken === '00000000000000000000000000000000' ||
            event.replyToken === 'ffffffffffffffffffffffffffffffff') {
            return;
          }
          return handleEvent(event);
      }))
      .then(()=>res.end())
      .catch((err)=>{
        console.error(err);
        res.status(500).end();
      })
});

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          if(event.message.text[0]=='!'){
            return replyText(event.replyToken, 'apaan sih');
          }
        case 'file':
          return handleFile(message, event.replyToken);
        default:
          return replyText(event.replyToken, 'Unknown message');
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      return replyText(event.replyToken, `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`);

    default:
      return replyText(event.replyToken, 'Unknown message');
  }
}

function handleFile(message, replyToken){
  try {
    const storageRef = firebase.storage().ref()
    var file = fs.createWriteStream("./" + message.fileName)
    var metadata = {
      contentType: message.type
    }
    client.getMessageContent(message.id)
      .then((stream) => {
        stream.on('data', (chunk) => {
          chunk.pipe(file);
        })
        stream.on('error', (err) => {
          return replyText(replyToken, 'File download error!')
        })
        storageRef.child(message.fileName).put(file)
      })
  }
  catch {
    return replyText(replyToken, "File Transfer Error")
  }
  finally {
    return replyText(replyToken, "Success")
  }
}

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});