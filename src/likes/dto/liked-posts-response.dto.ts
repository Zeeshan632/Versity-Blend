import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from '../../posts/dto/post-response.dto';

export class LikedPostsResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request completed successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Number of posts liked by the requested user',
    example: 9,
  })
  likedPostsCount: number;

  @ApiProperty({
    description: 'Array of posts liked by the specified user',
    type: [PostResponseDto],
  })
  likedPosts: PostResponseDto[];
}
