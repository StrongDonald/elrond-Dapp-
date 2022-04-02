import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import configuration from '../config/configuration';
import { ApiConfigService } from './common/api.config.service';
import { ApiService } from './common/api.service';
import { CachingService } from './common/caching.service';
import { VmQueryService } from './common/vm.query.service';
import { PingPongController } from './endpoints/ping.pong/ping.pong.controller';
import { PingPongService } from './endpoints/ping.pong/ping.pong.service';
import { MetricsService } from './endpoints/metrics/metrics.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    CacheModule.register(),
    WinstonModule.forRoot({
      level: 'verbose',
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
      transports: [
        new winston.transports.Console({ level: 'info' }),
        new DailyRotateFile({
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          createSymlink: true,
          dirname: 'dist/logs',
          symlinkName: 'application.log',
          format: winston.format.json()
        }),
      ]
    }),
  ],
  controllers: [
    PingPongController
  ],
  providers: [
    PingPongService, ApiConfigService, MetricsService, CachingService, ApiService, VmQueryService,
  ],
  exports: [
    ApiConfigService, MetricsService, CachingService, PingPongService
  ],
})
export class PublicAppModule {}
