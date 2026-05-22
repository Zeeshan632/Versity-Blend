import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./conversation.entity";
import { User } from "src/user/entity/user.entity";

enum deletedFor {
    ME= 'me',
    EVERYONE = 'everyone'
}

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation;

    @ManyToOne(() => User)
    sender: User;

    @Column('text')
    content: string;

    @Column('boolean', {default: false})   
    messageSeen: boolean;

    @ManyToOne(() => Message, {nullable: true})
    replyTo: Message;

    @Column('boolean')
    isDeleted: boolean;

    @Column({type: 'enum', enum: deletedFor, default: null, nullable: true})
    deletedFor: deletedFor;

    @CreateDateColumn()
    createdAt: Date;
}