import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActionResponseDto {
  @ApiProperty({
    description: 'Whether the operation completed successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'A human-readable result message for the client',
    example: 'Operation completed successfully.',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Optional payload returned for the request',
    example: { updatedRecord: { id: 12 } },
  })
  data?: unknown;
}
