export class configDto {
    version: string
    environment: string
    dmcEndpoint: string
    dmcToken: string
    replyEndpoint: string
    replyToken: string
    dmcLogEndpoint: string
    dmcLogToken: string
    lineWebhookApi: lineWebhookApiDto[]
}

export class lineWebhookApiDto {
    endpoint: string
    eventType: string[]
    messageInKeyword: string[]
    messageExKeyword: string[]
    isChannel: boolean
}