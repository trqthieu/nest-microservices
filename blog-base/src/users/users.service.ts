import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/User.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/utils/bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  getUsers() {
    return this.usersRepository.find();
  }
  async createUser(userData: CreateUserDto) {
    const user = await this.usersRepository.findOneBy({
      email: userData.email,
    });
    if (user) {
      throw new HttpException(
        'Email has already exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
    // const password = await encodePassword(userData.password);
    // const newUser = this.usersRepository.create({ ...userData, password });
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }
  getUserById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
  async findOne(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async updateUser(id: number, userData: UpdateUserDto) {
    const { fullName, username, description, password, avatar } = userData;
    const updateData: Partial<User> = {};

    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;
    if (description) updateData.description = description;
    if (password) updateData.password = hashPassword(password);
    if (avatar) updateData.avatar = avatar;

    if (Object.keys(updateData).length > 0) {
      await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set(updateData)
        .where('id = :id', { id: id })
        .execute();
    }
  }

  async deleteUser(id: number) {
    return await this.usersRepository.delete(id);
  }
}
