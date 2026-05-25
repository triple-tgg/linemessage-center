import { Module } from '@nestjs/common';
import { LineWebhookController } from './line-webhook.controller';
import { LineWebhookService } from './line-webhook.service'
import { ReplyWehookEvent } from './reply-webhook.event';
import { AILoggerService } from '../common/logger/appinsight.logger.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [LineWebhookController],
  providers: [
    ReplyWehookEvent,
    LineWebhookService,
    AILoggerService
  ]
})
export class LineModule {}
