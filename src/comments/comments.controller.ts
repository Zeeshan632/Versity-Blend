import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthenticatedRequest } from 'src/types/express';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create/:postId')
  createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentsService.createComment(
      postId,
      req.user.userId,
      createCommentDto,
    );
  }

  @Patch('update/:commentId')
  updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @Delete('delete/:commentId')
  deleteComment(@Param('commentId', ParseIntPipe) commentId: number, @Req() req: AuthenticatedRequest) {
    return this.commentsService.deleteComment(commentId, req.user.userId);
  }

  @Get('/:postId')
  getCommentsOfAPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.getCommentsOfAPost(postId);
  }
}
