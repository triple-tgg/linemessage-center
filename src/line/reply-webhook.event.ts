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
    this.aiLoggerService.info(`FUNC ::: Event ReplyMessage ::: payload: ${JSON.stringify(payload)}`)
    try {

      const requestConfig: AxiosRequestConfig = {
        url: payload.endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-line-signature': payload.xLineSignature,
        },
        data: payload.requestBody
      }

        const response = await lastValueFrom(
          this.httpService.request(requestConfig)
        )
        const monitorLog = {
          payload,
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
