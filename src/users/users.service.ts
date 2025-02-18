import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User, userSchema } from './schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel('user') private usersModel: Model<User>) {}

  async onModuleInit() {
    const count = await this.usersModel.countDocuments();

    const usersList: Partial<User>[] = [];
    for (let i = 0; i < 30000; i++) {
      const fakeUser = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 80 }),
      };
      usersList.push(fakeUser);
    }
    await this.usersModel.insertMany(usersList);
    console.log('created');
  }

  async create(CreateUserDto: CreateUserDto) {
    const existUser = await this.usersModel.findOne({
      email: CreateUserDto.email,
    });
    console.log(existUser, 'existUser');
    if (existUser) throw new BadRequestException('User already exists');
    const user = await this.usersModel.create(CreateUserDto);
    return user;
  }

  findAll({ page, take }: QueryParamsDto) {
    const limit = Math.min(take, 50);
    return this.usersModel
      .find()
      .skip((page - 1) * take)
      .limit(limit);
  }

  async getUser() {
    return await this.usersModel.find({ age: { $gte: 20, $lte: 25 } });
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
