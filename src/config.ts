import { configDto } from './config.dto'

const Environment: string = process.env.environment ?? ''
const development: configDto = {
    version: "0.03",
    environment: Environment.toUpperCase(),
    dmcEndpoint: 'https://prd-apigateway.sansiri.com/crud/s-line-user-activity',
    dmcToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDZjYzAyLTU1NTUtNDNiMy05ZjU0LWU4YzU1NzI4ODg4NyIsImlhdCI6MTczNjc1MjM3M30.zI3KOXfqz37AuP4jbRkjji_56c3F7cJSv9yVg1Lxm90',
    dmcLogEndpoint: 'https://prd-apigateway.sansiri.com/crud/s-line-log',
    dmcLogToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDZjYzAyLTU1NTUtNDNiMy05ZjU0LWU4YzU1NzI4ODg4NyIsImlhdCI6MTczNjc1MjM3M30.zI3KOXfqz37AuP4jbRkjji_56c3F7cJSv9yVg1Lxm90',
    replyEndpoint: 'https://api.line.me/v2/bot/message/reply',
    replyToken: 'pREsGPtsZwlYTh3l2r6wongymLYFrFj9BsB/UkwRWM13Nk34x9Ia1IHmq7JwN7EjZxNHblLcmQtfzESGfLNGUFFoBEFcZv3gj8qocya+e0DDblsTn2EkcrN92iY981+tCiO3AHoF7JHe+7cvoPRNyQdB04t89/1O/w1cDnyilFU=',
    lineWebhookApi: [
        {
            endpoint: "https://xxx-dmb.sansiri.com/API/Line/MessageWebhook/89254119-9CF3-4B3D-A5D1-090D0F357D93",
            eventType: ["message"],
            messageInKeyword: ["LBE", "LBD"],
            messageExKeyword: [],
            isChannel: false
        },
        {
            endpoint: "https://xxx-dmb.sansiri.com/API/Line/MessageWebhook/89254119-9CF3-4B3D-A5D1-090D0F357D93",
            eventType: ["beacon"],
            messageInKeyword: [],
            messageExKeyword: [],
            isChannel: false
        },
        {
            endpoint: "https://xxx-stg-api.sansiri.net/sfdc-chat-webhook/webhook",
            eventType: ["message", "unsend", "follow", "unfollow", "join", "leave", "memberJoined", "memberLeft", "postback", "videoPlayComplete", "accountLink", "things"],
            messageInKeyword: [],
            messageExKeyword: [],
            isChannel: true
        },
        {
            endpoint: "https://xxx-fresh-liger-23.telebit.io/line/hook2",
            eventType: ["message", "beacon"],
            messageInKeyword: ["LBE", "LBD"],
            messageExKeyword: [],
            isChannel: true
        },
        {
            endpoint: "https://-NO-MESSAGE-BEACONENABLEREPLYMESSAGE",
            eventType: ["message"],
            messageInKeyword: [],
            messageExKeyword: ["BEACONENABLEREPLYMESSAGE"],
            isChannel: true
        }
    ]
}

const staging: configDto = {
    version: "0.10",
    environment: Environment.toUpperCase(),
    dmcEndpoint: 'https://prd-apigateway.sansiri.com/crud/s-line-user-activity',
    dmcToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDZjYzAyLTU1NTUtNDNiMy05ZjU0LWU4YzU1NzI4ODg4NyIsImlhdCI6MTczNjc1MjM3M30.zI3KOXfqz37AuP4jbRkjji_56c3F7cJSv9yVg1Lxm90',
    dmcLogEndpoint: 'https://prd-apigateway.sansiri.com/crud/s-line-log',
    dmcLogToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDZjYzAyLTU1NTUtNDNiMy05ZjU0LWU4YzU1NzI4ODg4NyIsImlhdCI6MTczNjc1MjM3M30.zI3KOXfqz37AuP4jbRkjji_56c3F7cJSv9yVg1Lxm90',
    replyEndpoint: 'https://api.line.me/v2/bot/message/reply',
    replyToken: 'pREsGPtsZwlYTh3l2r6wongymLYFrFj9BsB/UkwRWM13Nk34x9Ia1IHmq7JwN7EjZxNHblLcmQtfzESGfLNGUFFoBEFcZv3gj8qocya+e0DDblsTn2EkcrN92iY981+tCiO3AHoF7JHe+7cvoPRNyQdB04t89/1O/w1cDnyilFU=',
    lineWebhookApi: [
        {
            endpoint: "https://xxx-dmb.sansiri.com/API/Line/MessageWebhook/89254119-9CF3-4B3D-A5D1-090D0F357D93",
            eventType: ["message", "beacon"],
            messageInKeyword: ["LBE", "LBD"],
            messageExKeyword: [],
            isChannel: false
        },
        {
            endpoint: "https://xxx-dmb.sansiri.com/API/Line/MessageWebhook/89254119-9CF3-4B3D-A5D1-090D0F357D93",
            eventType: ["beacon"],
            messageInKeyword: [],
            messageExKeyword: [],
            isChannel: false
        },
        {
            endpoint: "https://xxx-stg-api.sansiri.net/sfdc-chat-webhook/webhook",
            eventType: ["message", "unsend", "follow", "unfollow", "join", "leave", "memberJoined", "memberLeft", "postback", "videoPlayComplete", "accountLink", "things"],
            messageInKeyword: [],
            messageExKeyword: ["LBE", "LBD"],
            isChannel: true
        },
        {
            endpoint: "https://xxx-fresh-liger-23.telebit.io/line/hook2",
            eventType: ["message", "beacon"],
            messageInKeyword: ["BEACONENABLEREPLYMESSAGE", "BEACONDISABLEREPLYMESSAGE"],
            messageExKeyword: [],
            isChannel: true
        }
    ]
}

const production: configDto = {
    version: "0.10",
    environment: Environment.toUpperCase(),
    dmcEndpoint: 'https://prd-apigateway.sansiri.com/crud/s-line-user-activity',
    dmcToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDZjYzAyLTU1NTUtNDNiMy05ZjU0LWU4YzU1NzI4ODg4NyIsImlhdCI6MTczNjc1MjM3M30.zI3KOXfqz37AuP4jbRkjji_56c3F7cJSv9yVg1Lxm90',
    dmcLogEndpoint: 'https://prd-apigateway.sansiri.com/crud/s-line-log',
    dmcLogToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDZjYzAyLTU1NTUtNDNiMy05ZjU0LWU4YzU1NzI4ODg4NyIsImlhdCI6MTczNjc1MjM3M30.zI3KOXfqz37AuP4jbRkjji_56c3F7cJSv9yVg1Lxm90',
    replyEndpoint: 'https://api.line.me/v2/bot/message/reply',
    replyToken: 'Nwu3cwrxqETQN3D5kQHjVKIo3JDG5XRtj+wEh3Gifk9WeUnPbPj8Nb2Jc6YA7aGpKi/Eiue74X2kcoEOwmYizqbNlYdqPQWfHQl/qtPEdUFwTSvD5kULm9LxxIf5kfM0gJLdNqXw5GUy5n42+Q1iFwdB04t89/1O/w1cDnyilFU=',
    lineWebhookApi: [
        {
            endpoint: "https://makroconnect.com/line/webhook",
            eventType: ["message", "unsend", "follow", "unfollow", "join", "leave", "memberJoined", "memberLeft", "postback", "videoPlayComplete", "accountLink", "things"],
            messageInKeyword: [],
            messageExKeyword: [],
            isChannel: false
        }
    ]
}

const production_backup: configDto = {
    version: "0.10",
    environment: Environment.toUpperCase(),
    dmcEndpoint: 'https://prd-apigateway.sansiri.com/crud/s-line-user-activity',
    dmcToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDZjYzAyLTU1NTUtNDNiMy05ZjU0LWU4YzU1NzI4ODg4NyIsImlhdCI6MTczNjc1MjM3M30.zI3KOXfqz37AuP4jbRkjji_56c3F7cJSv9yVg1Lxm90',
    dmcLogEndpoint: 'https://prd-apigateway.sansiri.com/crud/s-line-log',
    dmcLogToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDZjYzAyLTU1NTUtNDNiMy05ZjU0LWU4YzU1NzI4ODg4NyIsImlhdCI6MTczNjc1MjM3M30.zI3KOXfqz37AuP4jbRkjji_56c3F7cJSv9yVg1Lxm90',
    replyEndpoint: 'https://api.line.me/v2/bot/message/reply',
    replyToken: 'Nwu3cwrxqETQN3D5kQHjVKIo3JDG5XRtj+wEh3Gifk9WeUnPbPj8Nb2Jc6YA7aGpKi/Eiue74X2kcoEOwmYizqbNlYdqPQWfHQl/qtPEdUFwTSvD5kULm9LxxIf5kfM0gJLdNqXw5GUy5n42+Q1iFwdB04t89/1O/w1cDnyilFU=',
    lineWebhookApi: [
        {
            endpoint: "https://xxx-dmb.sansiri.com/API/Line/MessageWebhook/D5822460-2991-42CA-A6EB-458523ABCC79",
            eventType: ["message", "beacon"],
            messageInKeyword: ["LBE", "LBD"],
            messageExKeyword: [],
            isChannel: false
        },
        {
            endpoint: "https://xxx-dmb.sansiri.com/API/Line/MessageWebhook/D5822460-2991-42CA-A6EB-458523ABCC79",
            eventType: ["beacon"],
            messageInKeyword: [],
            messageExKeyword: [],
            isChannel: false
        },
        {
            endpoint: "https://xxx-api.sansiri.net/sfdc-chat-webhook/webhook",
            eventType: ["message", "unsend", "follow", "unfollow", "join", "leave", "memberJoined", "memberLeft", "postback", "videoPlayComplete", "accountLink", "things"],
            messageInKeyword: [],
            messageExKeyword: ["LBE", "LBD"],
            isChannel: true
        }
    ]
}

let config = development
if (Environment !== '') {
    if (Environment.toUpperCase() === 'PRODUCTION') config = production
    if (Environment.toUpperCase() === 'STAGING') config = staging
}

export default config