import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return app info', () => {
    const result = appController.appName();
    expect(result).toHaveProperty('name', 'Line WebHooks!');
  });

  it('should return OK for health check', () => {
    expect(appController.HealthCheck()).toBe('OK');
  });
});
