import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../entity/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Identifier of the user who will receive the notification',
    example: 42,
  })
  @IsNumber()
  userId: number; // id of the receiver

  @ApiProperty({
    description: 'Identifier of the actor that triggered the notification',
    example: 18,
  })
  @IsNumber()
  actorId: number; // id of the actor

  @ApiProperty({
    description: 'Type of notification being created',
    enum: NotificationType,
    example: NotificationType.COMMENT,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({
    description: 'Optional reference identifier attached to the notification event',
    example: 183,
  })
  @IsOptional()
  refrenceId?: number;

  @ApiProperty({
    description: 'Message shown to the notification recipient',
    example: 'Your post received a new comment from your study group.',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Optional metadata for additional notification context',
    example: { postTitle: 'Weekend group study session' },
  })
  @IsOptional()
  meta?: Record<string, any>;
}