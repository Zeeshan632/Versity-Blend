import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Text content of the post, supporting university discussion topics',
    example: 'Planning a study group for the final economics exam—anyone interested?',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text: string;

  @ApiPropertyOptional({
    description: 'Optional visibility flag for making the post global across all universities',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  global: boolean;
}
