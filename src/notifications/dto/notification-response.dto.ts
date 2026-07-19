import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../entity/notification.entity';

export class NotificationResponseDto {
  @ApiProperty({ description: 'Unique identifier for the notification', example: 105 })
  id: number;

  @ApiProperty({ description: 'Type of notification event', enum: NotificationType, example: NotificationType.COMMENT })
  type: NotificationType;

  @ApiProperty({ description: 'Message shown to the notification recipient', example: 'Your post received a new comment from Mia.' })
  message: string;

  @ApiProperty({ description: 'Indicates whether the notification has been read', example: false })
  isRead: boolean;

  @ApiPropertyOptional({ description: 'Optional ID related to the notification event', example: 183 })
  refrenceId?: number;

  @ApiPropertyOptional({ description: 'Additional metadata for the notification event', example: { postTitle: 'Fall career fair volunteers needed' } })
  meta?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Creation timestamp for the notification', example: '2026-07-18T22:30:00.000Z' })
  createdAt?: Date;
}
