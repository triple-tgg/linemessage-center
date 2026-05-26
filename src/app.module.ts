import { 
  Module, 
  MiddlewareConsumer,
  RequestMethod
 } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineModule } from './line/line.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios'
import { ClsMiddleware, ClsModule } from 'nestjs-cls'
import { v1 as uuidv1 } from 'uuid'
import { LogsMiddleware } from './middleware/logs.middleware';
import { LoggerModule } from './common/logger/logger.module'
@Module({
  imports: [
    HttpModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
          mount: false,
          generateId: true,
          idGenerator: (req: Request) =>
            req.headers['X-Request-Id'] = uuidv1()
      }
    }),
    EventEmitterModule.forRoot(),
    LineModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, LogsMiddleware)
      .exclude(
        { path: '/line-webhook/.well-known/health', method: RequestMethod.ALL },
        { path: '/line-webhook', method: RequestMethod.ALL },
        { path: '/favicon.ico', method: RequestMethod.ALL }
      )
      .forRoutes(
        { path: '{*path}', method: RequestMethod.ALL },
      );
  }
}
