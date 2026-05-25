import {
  NestExpressApplication,
  ExpressAdapter,
} from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { LineModule } from './line/line.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: ['log', 'error', 'warn', 'debug'],
      rawBody: true
    },
  )
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Line-WebHook API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig, {
    include: [
      LineModule
    ],
  })

  SwaggerModule.setup('/line-webhook/doc', app, documentFactory)
  
  const port = process.env.PORT || 80
  await app.listen(port)
  console.log(`Application is running on: ${await app.getUrl()}`)
}




bootstrap();
