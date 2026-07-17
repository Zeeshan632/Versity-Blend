import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthenticatedRequest } from 'src/types/express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/upload/file-validation.pipe';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files', 5))
  createPost(
    @UploadedFile(new FileValidationPipe()) files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postService.createPost(createPostDto, +req.user.userId, files);
  }

  @Patch('update/:postId')
  updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: Partial<CreatePostDto>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postService.editPost(postId, updatePostDto, +req.user.userId);
  }

  @Get('global')
  getAllGlobalPosts(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.postService.getAllGlobalPosts(pageNumber, limit);
  }

  @Get('user/:userId')
  getPostsOfAUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.postService.getPostsOfAUser(userId, pageNumber, limit);
  }

  @Get('university/:universityId')
  getPostsOfAUniversity(
    @Param('universityId', ParseIntPipe) universityId: number,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.postService.getPostsOfAUniversity(
      universityId,
      pageNumber,
      limit,
    );
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }
}
