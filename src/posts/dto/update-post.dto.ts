import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    description: 'Updated text for the post',
    example: 'Updated post text for the same conversation thread.',
    maxLength: 1000,
  })
  text?: string;

  @ApiPropertyOptional({
    description: 'Update whether the post should be visible globally',
    example: false,
  })
  global?: boolean;
}
