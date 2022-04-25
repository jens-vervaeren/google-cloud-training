import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApplicationModule } from './application/application.module'
import { User } from './application/entities/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`],
      validationOptions: {
        allowUnknown: false,
        abortEarly: true
      }
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [User],
        synchronize: true
      })
    }),
    ApplicationModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  public static appPort: number

  constructor(readonly config: ConfigService) {
    AppModule.appPort = config.get<number>('APP_PORT')
  }
}
