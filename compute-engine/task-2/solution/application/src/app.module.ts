import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ApplicationModule } from './application/application.module'

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
