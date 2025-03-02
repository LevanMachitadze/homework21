import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsAuthGuard } from 'src/auth/auth .guard';
import { Subscription } from 'src/users/subscription.decorator';

@Controller('posts')
@UseGuards(IsAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Subscription() subscription,
    @Req() request,
    @Body() createPostDto: CreatePostDto,
  ) {
    // console.log(subscription);

    const userId = request.userId;

    return this.postsService.create(subscription, userId, createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Req() request, @Param('id') id: string) {
    const userId = request.userId;
    return this.postsService.remove(userId, id);
  }
}
