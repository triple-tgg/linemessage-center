import { Injectable } from '@nestjs/common';
import config from '../config'
import { configDto, lineWebhookApiDto } from '../config.dto'
import { EventEmitter2 } from '@nestjs/event-emitter';
import { replyMessageDto } from './dto/reply-message.dto'
import * as _ from 'lodash'
import { AILoggerService  } from '../common/logger/appinsight.logger.service';

@Injectable()
export class LineWebhookService {

    constructor (
        private readonly eventEmitter: EventEmitter2,
        private readonly aiLoggerService: AILoggerService,
    ) {}
    private aiLogger = (text: string) => this.aiLoggerService.info(text)
    
    public replyWebhook = async (xLineSignature: string, requestBody: any, channelId: string) => {
        this.aiLogger(`FUNC ::: ReplyWebhook START :::`)
        this.aiLogger(`FUNC ::: ReplyWebhook ::: xLineSignature:${xLineSignature}`)
        this.aiLogger(`FUNC ::: ReplyWebhook ::: requestBody:${requestBody}`)
        const endPointLists = this.endPointHook(channelId, JSON.parse(requestBody), config)
        this.aiLogger(`FUNC ::: ReplyWebhook ::: endPointLists:${JSON.stringify(endPointLists)}`)
        
        endPointLists.forEach(endPoint => {
            this.aiLogger(`FUNC ::: ReplyWebhook ::: Loop Event endPoint: ${endPoint}`)
            this.aiLogger(`FUNC ::: ReplyWebhook ::: Loop Event xLineSignature: ${xLineSignature}`)
            this.aiLogger(`FUNC ::: ReplyWebhook ::: Loop Event requestBody: ${requestBody}`)

            const replyMessage: replyMessageDto = {
                endPoint,
                xLineSignature,
                requestBody,
            }
            this.eventEmitter.emit('reply.message', replyMessage);
        });
    }


    public isMatch = (requestMsg: string , matchMsg: string) => {
        const regExp = new RegExp(matchMsg, 'g')
        const msgKeyword = requestMsg.match(regExp) ?? []
        return msgKeyword.length > 0
    }

    public addSeqNoEndPoint = (lineWebhookApi: lineWebhookApiDto[]) => {
        var deepLineWebhookApi: lineWebhookApiDto[] = _.cloneDeep(lineWebhookApi)
        const lineWebhookApiSeq = deepLineWebhookApi.map((value, index) => {
            value.endpoint = `${index}_${value.endpoint}`
            return value
        })
        return lineWebhookApiSeq
    }

    public removeSeqNoEndPoint = (lineWebhookApi: lineWebhookApiDto[]) => {
        return lineWebhookApi.map((value, index) => {
            value.endpoint = value.endpoint.substring(2)
            return value
        })
    }

    public endPointByMessageType = (lineWebhookApi: lineWebhookApiDto[], eventMessageType: string) => {
        let objectFilter = [] as lineWebhookApiDto[]
        lineWebhookApi.forEach(x => {
            if (x.eventType.includes(eventMessageType)) {
                objectFilter.push(x)
            }
        })
        return objectFilter
    }
    
    public endPointByMessageInKeyword = (lineWebhookApi: lineWebhookApiDto[], rMessageKeyword: string) => {
        let objectFilter: lineWebhookApiDto[] = lineWebhookApi
        lineWebhookApi.forEach((x, index) => {
            if (x.messageInKeyword.length > 0) {
                const msgInKeyWord = x.messageInKeyword.filter(inKey => this.isMatch(rMessageKeyword, inKey))
                if (msgInKeyWord.length == 0) {
                    objectFilter = objectFilter.filter(o => o.endpoint !== x.endpoint)
                }
            }
        })
        return objectFilter
    }

    public endPointByMessageExKeyword = (lineWebhookApi: lineWebhookApiDto[], rMessageKeyword: string) => {
        let objectFilter: lineWebhookApiDto[] = lineWebhookApi
        lineWebhookApi.forEach((x, index) => {
            if (x.messageExKeyword.length > 0) {
                const msgInKeyWord = x.messageExKeyword.filter(inKey => this.isMatch(rMessageKeyword, inKey))
                if (msgInKeyWord.length > 0) {
                    objectFilter = objectFilter.filter(o => o.endpoint !== x.endpoint)
                }
            }
        })
        return objectFilter
    }

    public endPointHook = (channelId: string, requestBody: any, config: configDto) => {
        const lineWebhookApi = config.lineWebhookApi
        const eventMessageType = requestBody?.events[0]?.type ?? ''
        const message = requestBody?.events[0]?.message ?? ''
        const rMessageKeyword: string = message?.text ?? ''

        const lineWebhookApiSeq = this.addSeqNoEndPoint(lineWebhookApi)
        const objectLineWebhookByMsgType = this.endPointByMessageType(lineWebhookApiSeq, eventMessageType)
        const objectLineWebhookByByMsgInKeyword = this.endPointByMessageInKeyword(objectLineWebhookByMsgType, rMessageKeyword)
        const objectLineWebhookByByMsgExKeyword = this.endPointByMessageExKeyword(objectLineWebhookByByMsgInKeyword, rMessageKeyword)
        const removeWebhookApiSeq = this.removeSeqNoEndPoint(objectLineWebhookByByMsgExKeyword)

        const endPoint = [] as any[]
        removeWebhookApiSeq.forEach(x => {
            const webhook = removeWebhookApiSeq.find(e => e.endpoint === x.endpoint)
            if (webhook !== null) {
                if (webhook.isChannel) {
                    endPoint.push(`${x.endpoint}?channel_id=${channelId}`)
                } else {
                    endPoint.push(`${x.endpoint}`)
                }
            }
        })
       
        console.log(`::: EndPoint :::`, endPoint)
        return endPoint
    }
}
