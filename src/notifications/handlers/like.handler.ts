import { OnEvent } from '@nestjs/event-emitter';
import { Notification, NotificationType } from '../entity/notification.entity';
import { NotificationsService } from '../notifications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entity/posts.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Comment } from 'src/comments/entity/comment.entity';

export class LikeHandler {
  constructor(
    private readonly notificationsService: NotificationsService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  @OnEvent('user.likedPost')
  async handleLikedPost(payload: { userId: number; postId: number }) {
    const post = await this.postRepository.findOne({
      where: { id: payload.postId },
      relations: { author: true },
    });
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    await this.notificationsService.createNotification({
      userId: post.author.id,
      actorId: payload.userId,
      message: `${user.name} liked your post`,
      type: NotificationType.LIKE_POST,
      refrenceId: payload.postId,
      meta: { profilePicture: user.profilePicture },
    });
  }

  @OnEvent('user.deletedLikeOnPost')
  async handleDeleteLikeOnPost(payload: { userId: number; postId: number }) {
    const notification = await this.notificationRepository.findOne({
      where: { actor: { id: payload.userId }, refrenceId: payload.postId },
      relations: { user: true },
    });

    await this.notificationsService.deleteNotification(
      { notificationIds: [notification.id] },
      notification.user.id,
    );
  }

  @OnEvent('user.likedComment')
  async handleLikedComment(payload: { userId: number; commentId: number }) {
    const comment = await this.commentRepository.findOne({
      where: { id: payload.commentId },
      relations: { authorId: true },
    });
    const actor = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    await this.notificationsService.createNotification({
      actorId: payload.userId,
      userId: comment.authorId.id,
      message: `${actor.name} liked your comment`,
      type: NotificationType.LIKE_COMMENT,
      refrenceId: payload.commentId,
      meta: { profilePicture: actor.profilePicture },
    });
  }

  @OnEvent('user.deletedLikeOnComment')
  async handleDeletedLikeOnComment(payload: {
    userId: number;
    commentId: number;
  }) {
    const notification = await this.notificationRepository.findOne({
      where: { actor: { id: payload.userId }, refrenceId: payload.commentId },
    });

    await this.notificationsService.deleteNotification(
      { notificationIds: [notification.id] },
      payload.userId,
    );
  }
}
