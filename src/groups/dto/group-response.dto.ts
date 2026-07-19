import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({ description: 'Unique identifier for the group', example: 57 })
  id: number;

  @ApiProperty({ description: 'Group name visible to members', example: 'Campus Sustainability Club' })
  name: string;

  @ApiProperty({ description: 'Short description of the group purpose', example: 'Students organizing campus-wide sustainability events.' })
  about: string;

  @ApiPropertyOptional({ description: 'Group administrator information', example: { id: 22, username: 'green_leader', name: 'Lina Chen' } })
  admin?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'List of current group members', type: [Object], example: [{ id: 22, username: 'green_leader' }, { id: 31, username: 'study_buddy' }] })
  members?: Record<string, unknown>[];

  @ApiPropertyOptional({ description: 'Associated university details for the group', example: { id: 5, name: 'Versity University' } })
  university?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Date when the group was created', example: '2026-04-12T14:00:00.000Z' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Date when the group was last updated', example: '2026-04-13T10:15:00.000Z' })
  updatedAt?: Date;
}
