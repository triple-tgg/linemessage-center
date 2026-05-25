export class configDto {
    version: string
    environment: string
    lineWebhookApi: lineWebhookApiDto[]
}

export class lineWebhookApiDto {
    endpoint: string
    eventType: string[]
    messageInKeyword: string[]
    messageExKeyword: string[]
    isChannel: boolean
}