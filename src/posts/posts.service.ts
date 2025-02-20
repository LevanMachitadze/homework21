import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { isValidObjectId, Model } from 'mongoose';
import { User } from 'src/users/schema/users.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('post') private postModel: Model<Post>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}

  async create(
    subscription: string,
    userId: string,
    createPostDto: CreatePostDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const postCount = user.posts.length;
    if (subscription === 'free' && postCount >= 10)
      throw new BadRequestException('upgrade subscription plan');
    if (subscription === 'basic' && postCount >= 100)
      throw new BadRequestException('upgrade subscription plan');
    if (subscription === 'premium' && postCount >= 300)
      throw new BadRequestException('upgrade subscription plan');
    console.log(subscription, 'subscribtion');
    console.log(userId, 'user id');

    const newPost = await this.postModel.create({
      ...createPostDto,
      user: user._id,
    });
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id },
    });
    return newPost;
  }

  findAll() {
    return this.postModel
      .find()
      .populate({ path: 'user', select: '-posts -createdAt -__v' });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(userId, id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');
    const deletedPost = await this.postModel.findByIdAndDelete(id);
    if (!deletedPost) throw new NotFoundException('Post not found');
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { posts: deletedPost._id },
    });

    return deletedPost;
  }
}
