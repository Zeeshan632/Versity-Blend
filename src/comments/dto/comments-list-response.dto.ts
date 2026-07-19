import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from './comment-response.dto';

export class CommentsListResponseDto {
  @ApiProperty({ description: 'A list of comments for the requested post', type: [CommentResponseDto] })
  comments: CommentResponseDto[];

  @ApiProperty({ description: 'Operation success flag', example: true })
  success: boolean;

  @ApiProperty({ description: 'Message describing the result of the request', example: 'Comments fetched successfully!' })
  message: string;
}
