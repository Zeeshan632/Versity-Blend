import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsService } from '../notifications.service';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification, NotificationType } from '../entity/notification.entity';
import { Post } from 'src/posts/entity/posts.entity';

export class CommentHandler {
  constructor(
    private readonly notificationService: NotificationsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  @OnEvent('user.createdComment')
  async handleCreateComment(payload: { actorId: number; postId: number }) {
    const actor = await this.userRepository.findOne({
      where: { id: payload.actorId },
    });
    const post = await this.postRepository.findOne({
      where: { id: payload.postId },
      relations: { author: true },
    });

    await this.notificationService.createNotification({
      userId: post?.author?.id,
      actorId: payload.actorId,
      message: `${actor.name} has commented on your post`,
      type: NotificationType.COMMENT,
      refrenceId: payload.postId,
      meta: { profilePicture: actor.profilePicture },
    });
  }

  @OnEvent('user.commentDeleted')
  async handleDeleteComment(payload: { commentId: number; authorId: number }) {
    const notification = await this.notificationRepository.findOne({
      where: { actor: { id: payload.authorId }, refrenceId: payload.commentId },
    });

    await this.notificationService.deleteNotification({notificationIds: [notification.id]}, payload.authorId)
  }
}
