import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UniversityResponseDto {
  @ApiProperty({ description: 'Unique identifier for the university', example: 5 })
  id: number;

  @ApiProperty({ description: 'Full official name of the university', example: 'Versity University' })
  name: string;

  @ApiProperty({ description: 'Official email domain used for student registration', example: 'versity.edu' })
  domain: string;

  @ApiPropertyOptional({ description: 'Abbreviation or brand short name', example: 'VU' })
  abbreviation?: string;

  @ApiPropertyOptional({ description: 'URL for the university logo', example: 'https://cdn.versityblend.app/universities/versity-logo.png' })
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Date when the university record was added', example: '2024-09-01T08:00:00.000Z' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Date when the university record was last updated', example: '2025-02-21T12:12:00.000Z' })
  updatedAt?: Date;
}
