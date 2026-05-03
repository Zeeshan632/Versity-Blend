import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import e from 'express';
import { ChatService } from './chat.service';
import { JoinRoomPayloadDto } from './dto/join-room-payload.dto';
import { GroupMessageDto } from './dto/group-message.dto';
import { TypingDto } from './dto/typing.dto';
import { Server, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { AuthService } from 'src/auth/auth.service';
import { ConnectedClientsService } from 'src/realtime/connected-clients.service';

@WebSocketGateway(8080, { path: '/ws' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService, private clients: ConnectedClientsService, private readonly authService: AuthService) {}
  
  private getUserIdFromRequest(req: any){
    const token = req.headers['authorization'];
    if(!token)return null;
    const payload = this.authService.verifyJwt(token)
    return payload ? payload.sub : null;
  }
  
  afterInit(server: Server) {
    console.log('🚀 WebSocket Gateway initialized');
  }

  handleConnection(client: WebSocket, req: any) {
    const userId = this.getUserIdFromRequest(req)
    if(userId){
      this.clients.addClient(userId, client)
    }

    client.on('error', (err) => {
      console.error('WebSocket error:', err);
    })
  }

  handleDisconnect(client: WebSocket) {
    const userId = (client as any).userId;
    this.clients.removeClient(userId);
    console.log(`Client disconnected: ${userId}`);
  }

  @SubscribeMessage('joinRoom')
  async handleMessage(client: WebSocket, payload: JoinRoomPayloadDto) {
    // return await this.chatService.handleJoin(client, payload);
  }

  @SubscribeMessage('groupMessage')
  async handleChatMessage(client: WebSocket, payload: GroupMessageDto){
    // return await this.chatService.handleGroupMessage(client, payload)
  }

  @SubscribeMessage('startTyping')
  async handleTyping(client: WebSocket, payload: TypingDto){
    // return await this.chatService.handleTyping(client, payload)
  }

}