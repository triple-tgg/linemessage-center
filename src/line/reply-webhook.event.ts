import { 
    Injectable, 
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { replyMessageDto } from './dto/reply-message.dto'
import { HttpService } from '@nestjs/axios'
import { map, lastValueFrom } from 'rxjs';
import { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AILoggerService } from 'src/common/logger/appinsight.logger.service';
@Injectable()
export class ReplyWehookEvent {
  constructor(
    private readonly httpService: HttpService,
    private readonly aiLoggerService: AILoggerService,
  ) {}

  @OnEvent('reply.message')
  async replyMessage(payload: replyMessageDto) {
    this.aiLoggerService.info(`FUNC ::: Event ReplyMessage Start :::`)
    const logPayload = {
      ...payload,
      requestBody: payload.requestBody.toString('utf-8')
    }
    this.aiLoggerService.info(`FUNC ::: Event ReplyMessage ::: payload: ${JSON.stringify(logPayload)}`)
    try {

      const bodyBuffer = payload.requestBody
      this.aiLoggerService.info(`FUNC ::: Event ReplyMessage DEBUG ::: bodyByteLength: ${bodyBuffer.length}, bodyHash: ${require('crypto').createHash('sha256').update(bodyBuffer).digest('hex').substring(0, 16)}`)

      const requestConfig: AxiosRequestConfig = {
        url: payload.endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Line-Signature': payload.xLineSignature,
          'User-Agent': 'LineBotWebhook/2.0',
        },
        data: bodyBuffer,
        transformRequest: [(data) => data],
      }

        const response = await lastValueFrom(
          this.httpService.request(requestConfig)
        )
        const monitorLog = {
          payload: logPayload,
          requestConfig: requestConfig,
          response: response.data ?? ''
        }
        this.aiLoggerService.info(`FUNC ::: Event ReplyMessage RESPONSE ::: ${payload.endPoint} ::: ${JSON.stringify(monitorLog)}`)
        this.aiLoggerService.info(`FUNC ::: Event ReplyMessage END :::`)
      } catch (error) {
        this.aiLoggerService.error(`FUNC ::: Event ReplyMessage ERROR::: ${payload.endPoint} ::: ${error.message}`)
        this.aiLoggerService.error(`FUNC ::: Event ReplyMessage ERROR::: ${payload.endPoint} RESPONSE ::: ${JSON.stringify(error.response?.data ?? '')}`)
    }

  }
}
