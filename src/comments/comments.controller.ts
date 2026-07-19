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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthenticatedRequest } from 'src/types/express';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create/:postId')
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiCreatedResponse({ description: 'Comment created successfully' })
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
  @ApiOperation({ summary: 'Update an existing comment' })
  @ApiOkResponse({ description: 'Comment updated successfully' })
  updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @Delete('delete/:commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiOkResponse({ description: 'Comment deleted successfully' })
  deleteComment(@Param('commentId', ParseIntPipe) commentId: number, @Req() req: AuthenticatedRequest) {
    return this.commentsService.deleteComment(commentId, req.user.userId);
  }

  @Get('/:postId')
  @ApiOperation({ summary: 'Retrieve all comments for a post' })
  @ApiOkResponse({ description: 'Comments retrieved' })
  getCommentsOfAPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.getCommentsOfAPost(postId);
  }
}
