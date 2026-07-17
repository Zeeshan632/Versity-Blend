import { Conversation } from 'src/chat/entities/conversation.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Election {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.elections)
  conversation: Conversation;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => User, { nullable: true })
  winner: User;

  @CreateDateColumn()
  createdAt: Date;
}
