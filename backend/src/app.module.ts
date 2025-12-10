import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { PronunciationModule } from './pronunciation/pronunciation.module';
import { ListeningComprehensionModule } from './listening-comprehension/listening-comprehension.module';
import { SentenceConstructionModule } from './sentence-construction/sentence-construction.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // shouldn't be used in production
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    VocabularyModule,
    PronunciationModule,
    ListeningComprehensionModule,
    SentenceConstructionModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
