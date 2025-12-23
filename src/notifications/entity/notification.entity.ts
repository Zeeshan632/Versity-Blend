import { IsOptional } from "class-validator";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum NotificationType {
  LIKE_POST ='postLiked',
  LIKE_COMMENT ='commentLiked',
  COMMENT='comment',
  REPLY='reply',
  FOLLOW='follow',
  SYSTEM='system'
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.notifications, {onDelete: 'CASCADE'})
  user: User
  
  @ManyToOne(() => User, user => user.notificationsSent)
  actor: User

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType

  @Column({
    nullable: true,
  })
  refrenceId?: number
  
  @Column()
  message: string

  @Column({
    type: 'boolean',
    default: false
  })
  isRead: boolean

  @Column({
    type: 'jsonb',
    nullable: true
  })
  meta: Record<string, any>

  @CreateDateColumn()
  createdAt: Date
}