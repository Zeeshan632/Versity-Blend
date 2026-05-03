import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Notification, NotificationType } from './entity/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationIdsDto } from './dto/mark-read.dto';
import { Post } from 'src/posts/entity/posts.entity';
import { User } from 'src/user/entity/user.entity';
import { ConnectedClientsService } from 'src/realtime/connected-clients.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly clients: ConnectedClientsService,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const newNotification = this.notificationRepository.create({
      user: { id: createNotificationDto.userId },
      actor: { id: createNotificationDto.actorId },
      type: createNotificationDto.type,
      message: createNotificationDto.message,
      refrenceId: createNotificationDto.refrenceId,
      meta: createNotificationDto.meta,
    });
    await this.notificationRepository.save(newNotification);
    this.clients.send(
      createNotificationDto.userId,
      'notification',
      newNotification,
    );

    return { success: true, messaeg: 'notification created successfully!' };
  }

  async getUserNotification(userId: number, page: number, limit: number) {
    const [notificatoins, total] =
      await this.notificationRepository.findAndCount({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      success: true,
      message: 'Notifications fetched successfully!',
      data: notificatoins,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markRead(notificationIdsDto: NotificationIdsDto, userId: number) {
    try {
      const result = await this.notificationRepository.update(
        { id: In(notificationIdsDto.notificationIds), user: { id: userId } },
        { isRead: true },
      );

      return {
        success: true,
        message: 'Selected notification read successfully!',
        affectedNotifications: result.affected,
      };
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async markAllRead(userId: number) {
    await this.notificationRepository.update(
      { user: { id: userId } },
      { isRead: true },
    );

    return { success: true, message: 'All notifications turn read!' };
  }

  async deleteNotification(
    notificationIdsDto: NotificationIdsDto,
    userId: number,
  ) {
    try {
      await this.notificationRepository.delete({
        id: In(notificationIdsDto.notificationIds),
        user: { id: userId },
      });
      return { success: true, message: 'notification deleted successfully' };
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong while deleting the notifications!',
      );
    }
  }
}
