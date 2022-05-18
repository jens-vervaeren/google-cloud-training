// eslint-disable-next-line @typescript-eslint/no-var-requires
const os = require('os')
import { Controller, Get } from '@nestjs/common'

@Controller()
export class IndexController {
  @Get()
  index(): string {
    return `Application installed. This is version 1. Running on host: ${os.hostname()}`
  }
}
