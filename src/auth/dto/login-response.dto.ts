import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class LoginResponseDto extends UserResponseDto {
  @ApiProperty({
    description: 'JWT access token used to authenticate requests',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckB1bml2ZXJzaXR5LmVkdSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjYwMDAwMDAsImV4cCI6MTY2MDAwMzYwMH0.xxxxxx',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token used to request new access tokens',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.yyyyyy',
  })
  refreshToken: string;
}
