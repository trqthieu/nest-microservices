import { Injectable } from '@nestjs/common';
import { User } from './user.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleUserCreated(data: User) {
    console.log('COMMUNICATION data', data);
  }
}
