import { Injectable } from '@nestjs/common';
import config  from './config'
@Injectable()
export class AppService {
  appName() {
    return {
      name: 'Line WebHooks!',
      vesion: config.version,
      environment: config.environment,
      // config: config.lineWebhookApi
    };
  }
}
