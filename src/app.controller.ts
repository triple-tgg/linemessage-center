import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/line-webhook')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  appName() {
    return this.appService.appName();
  }

  @Get('/.well-known/health')
  HealthCheck() {
    return 'OK'
  }
}
