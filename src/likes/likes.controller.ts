import { Controller, Param, ParseIntPipe, Post as HttpPost, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService){}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost(':postId')
  createLike(@Param('postId', ParseIntPipe) postId: number, @Req() req){
    return this.likesService.likePost(postId, +req.user.userId)
  }
}
