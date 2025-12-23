import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { Post } from 'src/posts/entity/posts.entity';
import { User } from 'src/user/entity/user.entity';
import { LikeHandler } from './handlers/like.handler';
import { Comment } from 'src/comments/entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification,  Post, User, Comment])],
  controllers: [NotificationsController],
  providers: [NotificationsService, LikeHandler]
})
export class NotificationsModule {}
