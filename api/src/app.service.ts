import { BadRequestException } from '@nestjs/common';

export class AppService {
  constructor() {}
  rootError() {
    throw new BadRequestException('Consult the documentation.');
  }
}
