import { Module } from '@nestjs/common';
import { AILoggerService } from './appinsight.logger.service';

@Module({
  providers: [AILoggerService],
  exports: [AILoggerService],
})
export class LoggerModule {}
