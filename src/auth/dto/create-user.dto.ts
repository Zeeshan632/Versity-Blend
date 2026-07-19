import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Desired username for the student account',
    example: 'campus_connector',
    minLength: 3,
    maxLength: 25,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  username: string;

  @ApiProperty({
    description: 'University email address used for registration and login',
    example: 'sophia.patel@versity.edu',
    maxLength: 50,
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Secure password for the account',
    example: 'Fall2026!Campus',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({
    description: 'Full name displayed in the campus social feed',
    example: 'Sophia Patel',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Student profile bio used to describe interests and campus activities',
    example: 'Political science freshman leading sustainability initiatives on campus.',
    minLength: 10,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  bio: string;

  @ApiPropertyOptional({
    description: 'Optional profile photo URL for the student account',
    example: 'https://cdn.versityblend.app/profiles/sophia-42.png',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  profilePicture: string;
}