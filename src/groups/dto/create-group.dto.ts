import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Display name for the group within the user community',
    example: 'Campus Sustainability Club',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the group mission and activities',
    example: 'A student-led group coordinating sustainability initiatives across campus.',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  about: string;
}