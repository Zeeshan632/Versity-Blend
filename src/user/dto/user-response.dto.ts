import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entity/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 42,
  })
  id: number;

  @ApiProperty({
    description: 'Account username used for login and display',
    example: 'campus_scholar',
  })
  username: string;

  @ApiProperty({
    description: 'Verified university email address for the user',
    example: 'sophia@versity.edu',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Sophia Patel',
  })
  name: string;

  @ApiProperty({
    description: 'Student profile biography or tagline',
    example: 'First-year political science major passionate about campus sustainability.',
  })
  bio: string;

  @ApiProperty({
    description: 'Role assigned to the user account',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'URL of the profile picture stored for the user',
    example: 'https://cdn.universitysite.edu/profiles/42.png',
  })
  profilePicture: string;

  @ApiPropertyOptional({
    description: 'Timestamp when the user account was created',
    example: '2025-11-03T14:22:31.000Z',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Timestamp when the user account was last updated',
    example: '2025-12-12T09:18:47.000Z',
  })
  updatedAt?: Date;
}
