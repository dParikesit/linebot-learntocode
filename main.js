const { middleware } = require('@line/bot-sdk');
const express = require('express')
const line = requrie('@line/bot-sdk')

const config = {
    channelAccessToken: 'tO8KP++qtzpLe8i8TigzPv9Uj7YQNeT0VmCin6pj7VQamehVvJ4ZDNf4vi4lV5+sG3uheyiTzPaT7Eg68z0QpZlADmnCiYmnJaMn0ykGBV0TasHRTNB5kZFUPznYZU7f0CHAHP520ttDJJf4If+iSQdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'bfcd58bea8e183ca9941cf15729f37da'
}

const app = express();
app.use(middleware(config))