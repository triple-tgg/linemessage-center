import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { format } from 'date-fns';
import config from '../../config';

@Injectable()
export class AILoggerService {
  constructor(
    private readonly cls: ClsService,
  ) {}

  error(message: string, ...meta: any[]) {
    console.error(this.formatter('ERROR', message));
  }

  warn(message: string, ...meta: any[]) {
    console.warn(this.formatter('WARN', message));
  }

  info(message: string, ...meta: any[]) {
    console.log(this.formatter('INFO', message));
  }

  debug(message: string, ...meta: any[]) {
    console.debug(this.formatter('DEBUG', message));
  }

  log(message: string, ...meta: any[]) {
    console.log(this.formatter('INFO', message));
  }

  private formatter = (level: string, log: string) => {
    const logId = this.cls.getId();
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    return `${timestamp} ::: ${logId} ::: ${config.environment} ::: LOG-${level} ::: ${log}`;
  }
}
