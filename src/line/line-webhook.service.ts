import { Injectable } from '@nestjs/common';
import config from '../config'
import { configDto, lineWebhookApiDto } from '../config.dto'
import { EventEmitter2 } from '@nestjs/event-emitter';
import { replyMessageDto } from './dto/reply-message.dto'
import * as _ from 'lodash'
import { HttpService } from '@nestjs/axios'
import { map, lastValueFrom } from 'rxjs';
import { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AILoggerService  } from '../common/logger/appinsight.logger.service';
import { format } from 'date-fns';

@Injectable()
export class LineWebhookService {

    constructor (
        private readonly httpService: HttpService,
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


        const modelBody:any = JSON.parse(requestBody)
        this.aiLogger(`FUNC ::: ReplyWebhook send to DMC ::: modelBody : ${JSON.stringify(modelBody)}`);
        modelBody.events.forEach(eventdata => {
            if (eventdata.type == "message" || eventdata.type == "unfollow")
            {
                let destination: string = modelBody.destination;
                let timestamp: number = eventdata.timestamp;
                let date = new Date(timestamp);
                let timestamp_to_date: string = format(date, 'yyyy-MM-dd HH:mm:ss');
                
                this.eventMessageAndUnfollow(eventdata, destination, timestamp, timestamp_to_date);
                this.saveLogDMC(modelBody);
            }
            else if (eventdata.type == "follow")
            {
                let destination: string = modelBody.destination;
                let timestamp: number = eventdata.timestamp;
                let date = new Date(timestamp);
                let timestamp_to_date: string = format(date, 'yyyy-MM-dd HH:mm:ss');
                
                this.eventFollow(eventdata, destination, timestamp, timestamp_to_date);
                this.saveLogDMC(modelBody);
            }
        });
 
    }
    

    public async eventFollow(eventdata:any, destination: string, timestamp:number, timestamp_to_date:string)
    {
        let is_unblocked = eventdata.follow.isUnblocked;

        const requestConfig: AxiosRequestConfig = {
            url: config.dmcEndpoint,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': config.dmcToken
            },
            data: {
                lu_id: eventdata.source.userId,
                lu_timestamp: timestamp,
                lu_timestamp_to_date: timestamp_to_date,
                type: eventdata.type,
                is_unblocked: is_unblocked,
                destination: destination
            }
        }

        const response = await lastValueFrom(
            this.httpService.request(requestConfig)
        );

        let dataLog = {
            lu_id: eventdata.source.userId,
            lu_timestamp: timestamp,
            lu_timestamp_to_date: timestamp_to_date,
            type: eventdata.type,
            is_unblocked: is_unblocked,
            destination: destination
        }

        this.aiLogger(`FUNC ::: ReplyWebhook send to DMC response ::: endPoint:${config.dmcEndpoint} ::: envet type : ${eventdata.type} ::: body : ${JSON.stringify(dataLog)} ::: response : ${JSON.stringify(response.data ?? '')}`);
    }

    public async eventMessageAndUnfollow(eventdata:any, destination: string, timestamp:number, timestamp_to_date:string)
    {
        const requestConfig: AxiosRequestConfig = {
            url: config.dmcEndpoint,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': config.dmcToken
            },
            data: {
                lu_id: eventdata.source.userId,
                lu_timestamp: timestamp,
                lu_timestamp_to_date: timestamp_to_date,
                type: eventdata.type,
                destination: destination
            }
        }

        const response = await lastValueFrom(
            this.httpService.request(requestConfig)
        );

        let dataLog = {
            lu_id: eventdata.source.userId,
            lu_timestamp: timestamp,
            lu_timestamp_to_date: timestamp_to_date,
            type: eventdata.type,
            destination: destination
        }

        this.aiLogger(`FUNC ::: ReplyWebhook send to DMC response ::: endPoint:${config.dmcEndpoint} ::: envet type : ${eventdata.type} ::: body : ${JSON.stringify(dataLog)} ::: response : ${JSON.stringify(response.data ?? '')}`);

        // type = message กรณี ที่เจอ  message = 'ineedhelp' จะ return uid 
        if (eventdata.type == "message")
        {
            let strMessage = eventdata.message.text;
            if (strMessage == "ineedhelp")
            {
                const requestConfigINeedHelp: AxiosRequestConfig = {
                    url: config.replyEndpoint,
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + config.replyToken
                    },
                    data: {
                        replyToken: eventdata.replyToken,
                        messages: [
                            {
                                type: "text",
                                text: eventdata.source.userId
                            }
                        ]
                    }
                }

                let dataLogIneedhelp = {
                    replyToken: eventdata.replyToken,
                    messages:  [
                        {
                            type: "text",
                            text: eventdata.source.userId
                        }
                    ]
                }
                const responseUUID = await lastValueFrom(
                    this.httpService.request(requestConfigINeedHelp)
                );

                this.aiLogger(`FUNC ::: ReplyWebhook send ineedhelp response ::: endPoint:${config.replyEndpoint} ::: envet type : ${eventdata.type} ::: body : ${JSON.stringify(dataLogIneedhelp)} ::: response : ${JSON.stringify(responseUUID.data ?? '')}`);
            }
        }
    }

    public async saveLogDMC(modelBody:any)
    {
        const requestLogConfig: AxiosRequestConfig = {
            url: config.dmcLogEndpoint,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': config.dmcLogToken
            },
            data: {
                line_json: JSON.stringify(modelBody)
            }
        }

        const responseLog = await lastValueFrom(
            this.httpService.request(requestLogConfig)
        );

        let mLogData =  {
            line_json: JSON.stringify(modelBody)
        }
        const resData = responseLog.data ?? '';
        this.aiLogger(`FUNC ::: ReplyWebhook send to DMC Log ::: endPoint:${config.dmcLogEndpoint} ::: body : ${JSON.stringify(mLogData)} ::: response : ${JSON.stringify(resData)}`);
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
