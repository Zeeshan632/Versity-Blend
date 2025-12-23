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
import { NotificationsService } from './notifications.service';
import { AuthenticatedRequest } from 'src/types/express';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { NotificationIdsDto } from './dto/mark-read.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
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
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Patch('/mark-read')
  markRead(
    @Body() notificationIdsDto: NotificationIdsDto ,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.markRead(notificationIdsDto, req.user.userId);
  }

  @Patch('/mark-all-read')
  markAllRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  @Delete('/')
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
