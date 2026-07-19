import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';

export class PaginatedPostsResponseDto {
  @ApiProperty({
    description: 'Array of posts matching the requested filters and page',
    type: [PostResponseDto],
  })
  data: PostResponseDto[];

  @ApiProperty({
    description: 'Total number of matching posts in the system',
    example: 125,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number returned by the request',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Total number of pages based on the requested page size',
    example: 13,
  })
  totalPages: number;
}
