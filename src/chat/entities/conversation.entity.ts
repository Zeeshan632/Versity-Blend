import { Group } from 'src/groups/entity/group.entity';
import { University } from 'src/universities/universities.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationParticipant } from './conversation-participant.entity';
import { Message } from './message.entity';
import { Election } from 'src/election/entity/election.entity';

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  UNIVERSITY = 'university',
}

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ConversationType })
  type: ConversationType;

  @OneToOne(() => Group, { lazy: true })
  @JoinColumn()
  group: Group;

  @OneToOne(() => University, (university) => university.conversation)
  @JoinColumn()
  university: University;

  @OneToMany(
    () => ConversationParticipant,
    (participant) => participant.conversation,
  )
  participants: ConversationParticipant[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => Election, (election) => election.conversation)
  elections: Election[];

  @CreateDateColumn()
  createdAt: Date;
}
