import { ApiProperty } from '@nestjs/swagger';
import { LikeResponseDto } from './like-response.dto';

export class LikeListResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Total number of likes returned by the query',
    example: 12,
  })
  likesCount: number;

  @ApiProperty({
    description: 'The list of likes returned for the requested resource',
    type: [LikeResponseDto],
  })
  likes: LikeResponseDto[];
}
