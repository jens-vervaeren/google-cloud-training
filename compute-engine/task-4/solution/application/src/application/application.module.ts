import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IndexController } from './controllers/index.controller'
import { UserController } from './controllers/user.controller'
import { User } from './entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [IndexController, UserController],
  providers: [],
  exports: [TypeOrmModule]
})
export class ApplicationModule {}
