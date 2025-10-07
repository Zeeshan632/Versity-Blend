import { Body, Controller, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService
  ){}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  createPost(@Body() createPostDto: CreatePostDto, @Req() req){
    return this.postService.createPost(createPostDto, +req.user.userId)
  }

  @Patch('update/:postId')
  @UseGuards(AuthGuard('jwt'))
  updatePost(@Param('postId', ParseIntPipe) postId: number, @Body() updatePostDto: Partial<CreatePostDto>){
    return this.postService.editPost(postId, updatePostDto)
  }
}
