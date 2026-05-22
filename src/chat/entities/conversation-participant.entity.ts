import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./conversation.entity";
import { User } from "src/user/entity/user.entity";

@Entity()
export class ConversationParticipant{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Conversation, conversation => conversation.participants)
    conversation: Conversation;

    @ManyToOne(() => User)
    user: User;

    @CreateDateColumn()
    joinedAt: Date;

    // has this user left the group or not
    @Column({default: false})
    hasLeft: boolean;

    @Column({default: 0})
    unreadCount: number;

    @Column({default: false})
    isBlocked: boolean
}