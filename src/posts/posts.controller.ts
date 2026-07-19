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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthenticatedRequest } from 'src/types/express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/upload/file-validation.pipe';

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiOperation({ summary: 'Create a new post with optional file attachments' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Post created successfully' })
  createPost(
    @UploadedFile(new FileValidationPipe()) files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postService.createPost(createPostDto, +req.user.userId, files);
  }

  @Patch('update/:postId')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiOkResponse({ description: 'Post updated successfully' })
  updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: Partial<CreatePostDto>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postService.editPost(postId, updatePostDto, +req.user.userId);
  }

  @Get('global')
  @ApiOperation({ summary: 'Retrieve global posts with pagination' })
  @ApiOkResponse({ description: 'Global posts retrieved' })
  getAllGlobalPosts(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.postService.getAllGlobalPosts(pageNumber, limit);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve posts from a specific user' })
  @ApiOkResponse({ description: 'User posts retrieved' })
  getPostsOfAUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.postService.getPostsOfAUser(userId, pageNumber, limit);
  }

  @Get('university/:universityId')
  @ApiOperation({ summary: 'Retrieve posts from a specific university' })
  @ApiOkResponse({ description: 'University posts retrieved' })
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
  @ApiOperation({ summary: 'Retrieve a specific post by ID' })
  @ApiOkResponse({ description: 'Post retrieved' })
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }
}
