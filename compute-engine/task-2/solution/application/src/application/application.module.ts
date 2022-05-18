import { Module } from '@nestjs/common'
import { IndexController } from './controllers/index.controller'

@Module({
  controllers: [IndexController],
  providers: []
})
export class ApplicationModule {}
