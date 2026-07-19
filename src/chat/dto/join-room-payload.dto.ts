import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinRoomPayloadDto {
  @ApiProperty({
    description: 'Identifier of the university room to join',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  universityId: number;
}