import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const databaseImports = isTestEnvironment
  ? []
  : [
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<number>('DB_PORT', 5432)),
          username: configService.get<string>('DB_USER', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'nutrisem'),
          synchronize: false,
          autoLoadEntities: true,
          logging:
            configService.get<string>('NODE_ENV', 'development') !==
            'production',
          ssl:
            String(
              configService.get<string>('DB_SSL', 'false'),
            ).toLowerCase() === 'true'
              ? { rejectUnauthorized: false }
              : false,
        }),
      }),
    ];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    ...databaseImports,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
