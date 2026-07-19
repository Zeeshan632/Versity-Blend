import { ApiProperty } from '@nestjs/swagger';
import { NotificationResponseDto } from './notification-response.dto';

export class PaginatedNotificationsResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Status message returned by the server',
    example: 'Notifications fetched successfully!',
  })
  message: string;

  @ApiProperty({
    description: 'Array of notifications for the authenticated user',
    type: [NotificationResponseDto],
  })
  data: NotificationResponseDto[];

  @ApiProperty({
    description: 'Total number of notifications available across all pages',
    example: 28,
  })
  total: number;

  @ApiProperty({
    description: 'Current page returned by the query',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Total number of pages available for this result set',
    example: 3,
  })
  totalPages: number;
}
