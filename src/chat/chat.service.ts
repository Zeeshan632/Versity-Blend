import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageDto } from './dto/message.dto';
import { ConnectedClientsService } from 'src/realtime/connected-clients.service';
import { Message } from './entities/message.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Conversation, ConversationType } from './entities/conversation.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ConversationParticipant)
    private readonly conversationParticipantRepo: Repository<ConversationParticipant>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,

    private readonly clients: ConnectedClientsService,
  ) {}

  async sendMessageToUniGroup(payload: MessageDto) {
    const conversationParticipants =
      await this.conversationParticipantRepo.find({
        where: { conversation: { id: payload.conversationId } },
        relations: { user: true },
      });
    if (conversationParticipants.length > 0) {
      try {
        const newMessage = this.messageRepo.create({
          content: payload.message,
          conversationId: payload.conversationId,
          senderId: payload.senderId,
        });
        const messageCreated = await this.messageRepo.save(newMessage);

        conversationParticipants.forEach((student) => {
          if (this.clients.isReady(student.user.id)) {
            this.clients.send(
              student.user.id,
              'uniGroupMessage',
              messageCreated,
            );
          }
        });
      } catch (err) {
        console.log(
          'Error with sending or saving message in uni group-->   ',
          err,
        );
      }
    }
  }

  async sendMessageToGroup(payload: MessageDto) {
    const conversationParticipants =
      await this.conversationParticipantRepo.find({
        where: { conversation: { id: payload.conversationId } },
        relations: { user: true },
      });

    if (conversationParticipants.length > 0) {
      try {
        const newMessage = this.messageRepo.create({
          content: payload.message,
          conversationId: payload.conversationId,
          senderId: payload.senderId,
        });
        const messageCreated = await this.messageRepo.save(newMessage);

        conversationParticipants.forEach((participant) => {
          if (this.clients.isReady(participant.user.id)) {
            this.clients.send(participant.user.id, 'generalGroupMessage',messageCreated);
          }
        });
      } catch (err) {
        console.log(
          'Error with sending or saving message in general group-->   ',
          err,
        );
      }
    }
  }

  async handleDirectMessage(payload: MessageDto) {
    let conversation: Conversation;
    if (!payload.conversationId) {
      if (!payload.receiverId) {
        throw new WsException(
          'Either conversationId or receiverId must be present!',
        );
      }
      const senderId = payload.senderId;
      const receiverId = payload.receiverId;
      conversation = await this.conversationRepo
        .createQueryBuilder('c')
        .innerJoin('c.participants', 'cp1', 'cp1.userId = :senderId', {
          senderId,
        })
        .innerJoin('c.participants', 'cp2', 'cp2.userId = :receiverId', {
          receiverId,
        })
        .where('c.type = :type', { type: ConversationType.DIRECT })
        .getOne();
      if(!conversation){
        const newConversation = this.conversationRepo.create({
          type: ConversationType.DIRECT,
        })
        conversation = await this.conversationRepo.save(newConversation)

        const senderParticipant = this.conversationParticipantRepo.create({
          conversation,
          user: {id: senderId}
        })
        const receiverParticipant = this.conversationParticipantRepo.create({
          conversation,
          user: {id: receiverId}
        })
        await this.conversationParticipantRepo.save([senderParticipant, receiverParticipant])
      }
    } else {
      conversation = await this.conversationRepo.findOne({
        where: { id: payload.conversationId },
      });
    }

    const newMessage = this.messageRepo.create({
      content: payload.message,
      conversationId: conversation.id,
      senderId: payload.senderId,
    });
    const messageCreated = await this.messageRepo.save(newMessage);

    const conversationParticipants = await this.conversationParticipantRepo.find({where: { conversation: { id: conversation.id } }, relations: {user: true}})

    conversationParticipants.forEach(participant => {
      if(this.clients.isReady(participant.user.id)){
        this.clients.send(participant.user.id, 'directMessage', messageCreated)
      }
    })
  }
}
