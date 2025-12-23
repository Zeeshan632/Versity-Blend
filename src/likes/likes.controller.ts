import {
  Controller,
  Param,
  ParseIntPipe,
  Post as HttpPost,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/types/express';

@UseGuards(AuthGuard('jwt'))
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @HttpPost('/post/:postId')
  createLike(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.likesService.likePost(postId, +req.user.userId);
  }

  @HttpPost('/comment/:commentId')
  createLikeOnComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.likesService.likeComment(commentId, req.user.userId);
  }

  @Get('/post/:postId')
  getLikesOfAPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.likesService.getAllLikesOfAPost(postId);
  }

  @Get('/comment/:commentId')
  getLikesOfAComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.likesService.getAllLikesOfAComment(commentId);
  }

  @Get('user-liked-posts/:userId')
  getUserLikedPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.likesService.getUserLikedPosts(userId);
  }
}
