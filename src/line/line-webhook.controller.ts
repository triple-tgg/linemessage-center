import { 
    Controller, 
    Post,
    Req,
    Res,
    Headers,
    RawBodyRequest,
    Query
} from '@nestjs/common';
import { LineWebhookService } from './line-webhook.service'
import { AILoggerService } from '../common/logger/appinsight.logger.service'
import { ApiTags } from '@nestjs/swagger'
import * as crypto from 'crypto'
@Controller('/line-webhook/api/line')
export class LineWebhookController {
  constructor(
    private readonly lineWebhookService: LineWebhookService,
    private readonly aiLoggerService: AILoggerService,
  ) {}

  @ApiTags('API Line-WebHook')
  @Post('/messageWebhook')
  async lineWebhook(@Headers() headers:any, @Query() query: any, @Req() req: RawBodyRequest<Request>, @Res() response: any) {
    try {
      const xLineSignature = headers['x-line-signature'] ?? ''
      const rawBody = Buffer.from(req.rawBody).toString()
      const channelId = query.channel_id ?? ''
      await this.lineWebhookService.replyWebhook(xLineSignature, rawBody, channelId)
      return response.status(200).json('OK')
    } catch (error) {
      this.aiLoggerService.error(`FUNC ::: lineWebhook ::: ${error.message}`)
      return response.status(500).json({
        err: error.message
      })
    }
    
  }
}
