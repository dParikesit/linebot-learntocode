const { middleware } = require('@line/bot-sdk');
const express = require('express')
const line = requrie('@line/bot-sdk')

const config = {
    channelAccessToken: process.env.accessToken,
    channelSecret: process.env.secret
}

const app = express();
app.use(middleware(config))