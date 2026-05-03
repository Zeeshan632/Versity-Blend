import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/groups/entity/group.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RealtimeModule } from 'src/realtime/realtime.module';
import { ConnectedClientsService } from 'src/realtime/connected-clients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), AuthModule, RealtimeModule],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
