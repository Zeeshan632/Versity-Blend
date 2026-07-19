import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({
    description: 'Identifier of the group receiving the new member',
    example: 18,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  groupId: number;

  @ApiProperty({
    description: 'Identifier of the user being added to the group',
    example: 42,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  userId: number;
}