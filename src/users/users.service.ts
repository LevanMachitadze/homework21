import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private usersModel: Model<User>) {}

  async create(CreateUserDto: CreateUserDto) {
    const existUser = await this.usersModel.findOne({
      email: CreateUserDto.emaill,
    });
    console.log(existUser, 'existUser');
    if (existUser) throw new BadRequestException('User already exists');
    const user = await this.usersModel.create(CreateUserDto);
    return user;
  }

  findAll() {
    return this.usersModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');
    const user = await this.usersModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');
    const deletedUser = await this.usersModel.findByIdAndDelete(id);
    if (!deletedUser) throw new BadRequestException('User not found');

    return deletedUser;
  }
}
