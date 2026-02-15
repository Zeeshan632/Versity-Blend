import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import e from 'express';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JoinRoomPayloadDto } from './dto/join-room-payload.dto';
import { GroupMessageDto } from './dto/group-message.dto';
import { TypingDto } from './dto/typing.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}
  
  afterInit(server: Server) {
    console.log('🚀 WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('✅ Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('❌ Client disconnected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  async handleMessage(client: Socket, payload: JoinRoomPayloadDto) {
    return await this.chatService.handleJoin(client, payload);
  }

  @SubscribeMessage('groupMessage')
  async handleChatMessage(client: Socket, payload: GroupMessageDto){
    return await this.chatService.handleGroupMessage(client, payload)
  }

  @SubscribeMessage('startTyping')
  async handleTyping(client: Socket, payload: TypingDto){
    return await this.chatService.handleTyping(client, payload)
  }

}