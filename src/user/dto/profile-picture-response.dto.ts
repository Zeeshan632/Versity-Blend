import { ApiProperty } from '@nestjs/swagger';

export class ProfilePictureResponseDto {
  @ApiProperty({
    description: 'URL of the updated user profile picture',
    example: 'https://cdn.versityblend.app/profiles/42-updated.png',
  })
  profilePicture: string;
}
