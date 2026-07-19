import {
  Controller,
  Param,
  ParseIntPipe,
  Post as HttpPost,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/types/express';

@ApiTags('Likes')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @HttpPost('/post/:postId')
  @ApiOperation({ summary: 'Like a post' })
  @ApiCreatedResponse({ description: 'Post liked successfully' })
  createLike(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.likesService.likePost(postId, +req.user.userId);
  }

  @HttpPost('/comment/:commentId')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiCreatedResponse({ description: 'Comment liked successfully' })
  createLikeOnComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.likesService.likeComment(commentId, req.user.userId);
  }

  @Get('/post/:postId')
  @ApiOperation({ summary: 'Get all likes for a post' })
  @ApiOkResponse({ description: 'Post likes retrieved' })
  getLikesOfAPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.likesService.getAllLikesOfAPost(postId);
  }

  @Get('/comment/:commentId')
  @ApiOperation({ summary: 'Get all likes for a comment' })
  @ApiOkResponse({ description: 'Comment likes retrieved' })
  getLikesOfAComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.likesService.getAllLikesOfAComment(commentId);
  }

  @Get('user-liked-posts/:userId')
  @ApiOperation({ summary: 'Get all posts liked by a user' })
  @ApiOkResponse({ description: 'User liked posts retrieved' })
  getUserLikedPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.likesService.getUserLikedPosts(userId);
  }
}
