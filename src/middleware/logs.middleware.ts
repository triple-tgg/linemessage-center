import { 
  Injectable, 
  NestMiddleware,
  RawBodyRequest
 } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AILoggerService } from '../common/logger/appinsight.logger.service'
import { ClsService } from 'nestjs-cls'
@Injectable()
export class LogsMiddleware implements NestMiddleware {
  constructor(
    private readonly clsService: ClsService,
    private readonly aiLoggerService: AILoggerService,
) {}
  use(request: RawBodyRequest<Request>, response: Response, next: NextFunction) {
    const logId = this.clsService.getId()
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    console.log(`[LOG] ::: REQUEST ID ::: ${logId} :::`)
    this.aiLoggerService.info(`${method} ${originalUrl} - ${userAgent} ${ip}`)
    this.aiLoggerService.info(`REQUEST HEADERS ${JSON.stringify(request.headers)}`)
    this.aiLoggerService.info(`REQUEST BODY ${Buffer.from(request.rawBody).toString()}`)

    let send = response.send;
    response.send = (exitData) => {
      const { statusCode } = response;
      if (
        response?.getHeader('content-type')?.toString().includes('application/json')
      ) {
        if (statusCode == 200) {
          this.aiLoggerService.info(`RESPONSE ${statusCode} : ${exitData}`)
        } else {
          this.aiLoggerService.error(`RESPONSE ${statusCode} : ${exitData}`)
        }
      }
      response.send = send;
      return response.send(exitData);
    };
    next();
  }
}