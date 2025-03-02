import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/users.schema';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp({ email, fullName, password }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) throw new BadRequestException('user already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    await this.userModel.create({ email, fullName, password: hashedPassword });

    return 'user registered succesfully';
  }

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel.findOne({ email });
    if (!existUser)
      throw new BadRequestException('Emaill or Password is invalid');

    const isPathEqual = await bcrypt.compare(password, existUser.password);
    if (!isPathEqual)
      throw new BadRequestException('Emaill or Password is invalid');

    const payLoad = {
      userId: existUser._id,
      subscription: existUser.subscriptionPlan,
      role: existUser.role,
    };
    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  async getCurrentUser(userId) {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }
}
