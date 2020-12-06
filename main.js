const express = require('express')
const line = requrie('@line/bot-sdk')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError

const config = {
    channelAccessToken: process.env.accessToken,
    channelSecret: process.env.secret
}

const app = express();
app.use(middleware(config))

app.post('/webhook', (req, res) => {
    res.json(req.body.events)
})

app.listen(8080)