import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/groups/entity/group.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RealtimeModule } from 'src/realtime/realtime.module';
import { User } from 'src/user/entity/user.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User, Conversation, ConversationParticipant, Message]), AuthModule, RealtimeModule, UploadModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
