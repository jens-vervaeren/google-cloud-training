import { Body, Controller, Get, Post } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from '../dto/createUser.dto'
import { User } from '../entities/user.entity'

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Get()
  async index(): Promise<User[]> {
    return await this.userRepository.find()
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User()
    newUser.first_name = createUserDto.firstName
    newUser.last_name = createUserDto.lastName

    return await this.userRepository.save(newUser)
  }
}
