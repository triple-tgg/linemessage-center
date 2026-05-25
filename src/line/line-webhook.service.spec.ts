import { Test, TestingModule } from '@nestjs/testing';
import { LineWebhookService } from './line-webhook.service';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AILoggerService } from '../common/logger/appinsight.logger.service';
import { ClsModule } from 'nestjs-cls';

const mockConfig = {
  version: "0.13",
  environment: '',
  lineWebhookApi: [
      {
          endpoint: "https://dmb.sansiri.com/API/Line/MessageWebhook/89254119-9CF3-4B3D-A5D1-090D0F357D93",
          eventType: ["message"],
          messageInKeyword: ["BEACONENABLEREPLYMESSAGE","BEACONDISABLEREPLYMESSAGE"],
          messageExKeyword: [],
          isChannel: false
      },
      {
        endpoint: "https://dmb.sansiri.com/API/Line/MessageWebhook/89254119-9CF3-4B3D-A5D1-090D0F357D93",
        eventType: ["beacon"],
        messageInKeyword: [],
        messageExKeyword: [],
        isChannel: false
      },
      {
          endpoint: "https://stg-api.sansiri.net/sfdc-chat-webhook/webhook",
          eventType: ["message","unsend","follow","unfollow","join","leave","memberJoined","memberLeft","postback","videoPlayComplete","accountLink","things"],
          messageInKeyword: [],
          messageExKeyword: [],
          isChannel: true
      },
      {
          endpoint: "https://fresh-liger-23.telebit.io/line/hook2",
          eventType: ["message","beacon"],
          messageInKeyword: ["BEACONENABLEREPLYMESSAGE","BEACONDISABLEREPLYMESSAGE"],
          messageExKeyword: [],
          isChannel: true
      },
      {
          endpoint: "https://xxxxxxxxxxxxxxxxx1",
          eventType: ["message","beacon"],
          messageInKeyword: [],
          messageExKeyword: [],
          isChannel: true
      },
      {
          endpoint: "https://-NO-MESSAGE-BEACONENABLEREPLYMESSAGE",
          eventType: ["message"],
          messageInKeyword: [],
          messageExKeyword: ["BEACONENABLEREPLYMESSAGE"],
          isChannel: true
      }
      
  ]
}


describe('LineWebhookServiceSpec', () => {
  let lineWebhookService: LineWebhookService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        EventEmitterModule.forRoot(),
        ClsModule.forRoot(),
      ],
      providers: [
        LineWebhookService,
        AILoggerService,
      ],
    })
    .compile();

    lineWebhookService = app.get<LineWebhookService>(LineWebhookService);
  });

  describe('get list endpoint', () => {

    it('endPointHook type (message) = 3', async () => {
      const request = JSON.parse('{"destination":"","events":[{"type":"message","message":{"type":"text","id":"17021383033214","text":"TEST"}}]}')
      const result = lineWebhookService.endPointHook('channel', request, mockConfig)
      expect(result.length).toEqual(3)
    }); 

    it('endPointHook (beacon) = 2', async () => {
      const request = JSON.parse('{"destination":"","events":[{"type":"beacon","message":{"type":"text","id":"17021383033214","text":"TEST"}}]}')
      const result = lineWebhookService.endPointHook('channel', request, mockConfig)
      expect(result.length).toEqual(2)
    }); 

    it('endPointHook (BEACONENABLEREPLYMESSAGE) = 4', async () => {
      const request = JSON.parse('{"destination":"","events":[{"type":"message","message":{"type":"text","id":"17021383033214","text":"BEACONENABLEREPLYMESSAGE"}}]}')
      const result = lineWebhookService.endPointHook('channel', request, mockConfig)
      expect(result.length).toEqual(4)
    }); 

    it('endPointHook (BEACONDISABLEREPLYMESSAGE) = 4', async () => {
      const request = JSON.parse('{"destination":"","events":[{"type":"message","message":{"type":"text","id":"17021383033214","text":"BEACONDISABLEREPLYMESSAGE"}}]}')
      const result = lineWebhookService.endPointHook('channel', request, mockConfig)
      expect(result.length).toEqual(5)
    }); 

    it('endPointHook (beacon) = 3', async () => {
      const request = JSON.parse('{"destination":"","events":[{"type":"beacon","message":{"type":"text","id":"17021383033214","text":"BEACONDISABLEREPLYMESSAGE"}}]}')
      const result = lineWebhookService.endPointHook('channel', request, mockConfig)
      expect(result.length).toEqual(3)
    }); 
  });

});
