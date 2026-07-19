import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ description: 'Unique identifier for the comment', example: 842 })
  id: number;

  @ApiProperty({ description: 'Text content of the comment', example: 'I totally agree with this idea—count me in!' })
  text: string;

  @ApiPropertyOptional({
    description: 'Reference to the author who created the comment',
    example: { id: 34, username: 'campus_voice', name: 'Aiden Rivera' },
  })
  authorId?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Reference to the post that the comment belongs to',
    example: { id: 183, text: 'Who else is joining the sustainability workshop?' },
  })
  post?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Creation timestamp for the comment', example: '2026-07-18T21:00:00.000Z' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last updated timestamp for the comment', example: '2026-07-18T21:15:00.000Z' })
  updatedAt?: Date;
}
