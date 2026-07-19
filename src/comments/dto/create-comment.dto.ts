import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text added to a specific post',
    example: 'This is a great event idea—please share the location details!',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}