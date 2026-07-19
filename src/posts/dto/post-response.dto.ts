import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the post',
    example: 183,
  })
  id: number;

  @ApiProperty({
    description: 'Main text content of the post',
    example: 'Who else is joining the sustainability workshop this Friday at 3pm?',
  })
  text: string;

  @ApiPropertyOptional({
    description: 'List of image URLs attached to the post',
    type: [String],
    example: [
      'https://cdn.versityblend.app/posts/image-183-1.jpg',
      'https://cdn.versityblend.app/posts/image-183-2.jpg',
    ],
  })
  images?: string[];

  @ApiProperty({
    description: 'Indicates whether the post is visible globally across the platform',
    example: false,
  })
  global: boolean;

  @ApiPropertyOptional({
    description: 'Author details when included in the request payload',
    example: { id: 12, username: 'campus_leader', name: 'Elena Kim' },
  })
  author?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'University details when this post is scoped to a campus community',
    example: { id: 5, name: 'Versity University' },
  })
  university?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Creation timestamp for the post',
    example: '2026-07-18T20:42:00.000Z',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Last updated timestamp for the post',
    example: '2026-07-18T20:45:30.000Z',
  })
  updatedAt?: Date;
}
