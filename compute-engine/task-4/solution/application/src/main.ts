import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(AppModule.appPort)
  console.log(`Application has started on port ${AppModule.appPort}`)
  console.log(`Accessible on: http://localhost:${AppModule.appPort}`)
}

bootstrap()
