import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/groups/entity/group.entity';
import { Repository } from 'typeorm';
import { JoinRoomPayloadDto } from './dto/join-room-payload.dto';
import { GroupMessageDto } from './dto/group-message.dto';
import { TypingDto } from './dto/typing.dto';
import { User } from 'src/user/entity/user.entity';
import { ConnectedClientsService } from 'src/realtime/connected-clients.service';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(ConversationParticipant)
    private readonly conversationParticipantRepo: Repository<ConversationParticipant>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    private readonly clients: ConnectedClientsService,
  ) {}

  async sendMessageToUniGroup(client: any, payload: any) {
    const conversationParticipants =
      await this.conversationParticipantRepo.find({
        where: { conversation: { id: payload.conversationId } },
        relations: { user: true },
      });
    console.log("----------->>>.   ", conversationParticipants)
    if (conversationParticipants.length > 0) {
      try {
        const newMessage = this.messageRepo.create({
          content: payload.message,
          conversation: { id: payload.conversationId },
          sender: { id: payload.senderId },
        });
        const messageCreated = await this.messageRepo.save(newMessage);

        conversationParticipants.forEach((student) => {
          if (this.clients.open(student.user.id)) {
            this.clients.send(student.user.id, 'uniGroupMessage', {
              message: messageCreated,
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}
