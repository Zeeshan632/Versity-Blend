import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LikeResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the like action',
    example: 621,
  })
  id: number;

  @ApiPropertyOptional({
    description: 'User who liked the item',
    example: { id: 32, username: 'campus_champion', name: 'Mina Shah' },
  })
  user?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Post that was liked',
    example: { id: 128, text: 'Can anyone recommend a good spot to study tonight?' },
  })
  post?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Comment that was liked',
    example: { id: 918, text: 'Great suggestion, I will be there.' },
  })
  comment?: Record<string, unknown>;
}
