import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';
import { TypingDto } from './dto/typing.dto';
import { Server, WebSocket } from 'ws';
import { AuthService } from 'src/auth/auth.service';
import { ConnectedClientsService } from 'src/realtime/connected-clients.service';

@WebSocketGateway(8080, { path: '/ws' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly clients: ConnectedClientsService,
    private readonly authService: AuthService,
  ) {}

  private getUserIdFromRequest(req: any) {
    const token = req.headers['authorization'];
    if (!token) return null;
    const payload = this.authService.verifyJwt(token);
    return payload ? payload.sub : null;
  }

  afterInit(server: Server) {
    console.log('🚀 WebSocket Gateway initialized');

    const pingInterval = setInterval(() => {
      server.clients.forEach((client: any) => {
        if (client?.isAlive === false) {
          this.clients.removeClient(client.userId);
          return client.terminate();
        }

        client.isAlive = false;
        client.ping();
      });
    }, 30000); // fires every 30 seconds

    server.on('close', () => clearInterval(pingInterval));
  }

  handleConnection(client: WebSocket, req: any) {
    (client as any).isAlive = true;
    client.on('pong', () => {
      (client as any).isAlive = true;
    });
    const userId = this.getUserIdFromRequest(req);
    if (userId) {
      (client as any).userId = userId;
      this.clients.addClient(userId, client);
    }

    client.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  }

  handleDisconnect(client: WebSocket) {
    const userId = (client as any).userId;
    this.clients.removeClient(userId);
  }

  @SubscribeMessage('uniGroupMessage')
  async handleMessageToUniGroup(client: WebSocket, payload: MessageDto) {
    return await this.chatService.sendMessageToUniGroup(payload);
  }

  @SubscribeMessage('groupMessage')
  async handleGroupMessage(client: WebSocket, payload: MessageDto){
    return await this.chatService.sendMessageToGroup(payload)
  }

  @SubscribeMessage('directMessage')
  async handleDirectMessage(client: WebSocket, payload: MessageDto){
    return await this.chatService.handleDirectMessage(payload)
  }

  @SubscribeMessage('startTyping')
  async handleTyping(client: WebSocket, payload: TypingDto) {
    // return await this.chatService.handleTyping(client, payload)
  }
}
