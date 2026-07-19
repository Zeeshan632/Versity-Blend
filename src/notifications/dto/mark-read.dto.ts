import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class NotificationIdsDto {
  @ApiProperty({
    description: 'Array of notification IDs to update or delete',
    type: [Number],
    example: [101, 102, 103],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  notificationIds: number[];
}