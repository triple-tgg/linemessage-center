import { configDto } from './config.dto'

const Environment: string = process.env.environment ?? ''
const development: configDto = {
    version: "0.03",
    environment: Environment.toUpperCase(),
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


let config = development
if (Environment !== '') {
    if (Environment.toUpperCase() === 'PRODUCTION') config = production
    if (Environment.toUpperCase() === 'STAGING') config = staging
}

export default config