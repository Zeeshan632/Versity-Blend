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
  async handleMessage(client: Socket, payload: any) {
    // return async this.chatService.handleJoin(client, payload)
    console.log(`${payload} is joining the room`)

    await client.join('group')
    
    //broadcast
    client.to('group').emit('roomNotice', payload)
    console.log('Received: ', payload)
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, payload: any){
    client.to('group').emit('chatMessage', payload)
  }

  @SubscribeMessage('startTyping')
  handleStartTyping(client: Socket, payload: any){
    client.to('group').emit('startTyping', payload)
  }wwww

  @SubscribeMessage('stopTyping')
  handleStopTyping(client: Socket, payload: any){
    client.to('group').emit('stopTyping', payload)
  }

}