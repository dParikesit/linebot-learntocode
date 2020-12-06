'use strict'

const express = require('express')
const line = require('@line/bot-sdk')
const crypto = require('crypto')
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
}

const middleware = line.middleware
const JSONParseError = line.JSONParseError
const client = new line.Client(config)

const app = express();
app.use(middleware(config))

app.post('/webhook', middleware(config), (req, res) => {
    if(req.body.events.length()==0){
        res.statusCode(200)
    }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});