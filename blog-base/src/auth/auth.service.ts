import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User.entity';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dtos/signup.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  private client: ClientProxy;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8877,
      },
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user?.confirm) {
      throw new BadRequestException('Account is not confirm');
    }
    if (!comparePassword(loginDto.password, user.password)) {
      throw new BadRequestException('Password is not match');
    }
    const access_token = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });
    return { access_token, user: user };
  }

  async confirm(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const { id } = payload;
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      user.confirm = true;
      return await this.userRepository.save(user);
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }

  async signup(signupDto: SignupDto) {
    const { email, description, fullName, username, password } = signupDto;
    const user = await this.userRepository.findOne({
      where: {
        email: signupDto.email,
      },
    });
    if (user) {
      throw new BadRequestException('User has been existed');
    }
    const hash = hashPassword(password);
    const newUser = new User();
    newUser.email = email;
    newUser.username = username;
    newUser.fullName = fullName;
    newUser.description = description;
    newUser.password = hash;
    newUser.confirm = false;
    const response = await this.userRepository.save(newUser);
    const token = this.jwtService.sign({
      id: response.id,
      role: response.role,
    });
    this.client.emit('send_email', { email: email, token: token });
    return response;
  }

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
  async getUser() {
    return await this.userRepository.find({});
  }
}
