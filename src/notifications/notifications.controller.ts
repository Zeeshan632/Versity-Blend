import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { AuthenticatedRequest } from 'src/types/express';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { NotificationIdsDto } from './dto/mark-read.dto';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications with pagination' })
  @ApiOkResponse({ description: 'Notifications retrieved' })
  getUserNotifications(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.getUserNotification(
      req.user.userId,
      page,
      limit,
    );
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiCreatedResponse({ description: 'Notification created' })
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Patch('/mark-read')
  @ApiOperation({ summary: 'Mark specific notifications as read' })
  @ApiOkResponse({ description: 'Notifications marked as read' })
  markRead(
    @Body() notificationIdsDto: NotificationIdsDto ,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.markRead(notificationIdsDto, req.user.userId);
  }

  @Patch('/mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiOkResponse({ description: 'All notifications marked as read' })
  markAllRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  @Delete('/')
  @ApiOperation({ summary: 'Delete notifications' })
  @ApiOkResponse({ description: 'Notifications deleted' })
  deleteNotification(
    @Body() notificationIdsDto: NotificationIdsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.deleteNotification(
      notificationIdsDto,
      req.user.userId,
    );
  }
}
