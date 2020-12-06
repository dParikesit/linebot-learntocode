'use strict'

const express = require('express')
const line = require('@line/bot-sdk')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
}

const middleware = line.middleware
const JSONParseError = line.JSONParseError
const client = new line.Client(config)

const app = express();

app.post('/webhook', middleware(config), (req, res) => {
    const body = JSON.stringify(req.body)
    const signature = crypto
      .createHmac('SHA256', channelSecret)
      .update(body).digest('base64');
    line.validateSignature(body,config.channelSecret,signature)
    if(req.body.events.length()==0){
        res.send(200)
    }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});