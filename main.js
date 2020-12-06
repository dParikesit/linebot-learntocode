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
    Promise
        if (req.body.events == []) {
            res.statusCode(200)
        }
})

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return {};
    }
  
    // create a echoing text message
    const echo = { type: 'text', text: event.message.text };
  
    // use reply API
    return client.replyMessage(event.replyToken, echo);
  }


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});