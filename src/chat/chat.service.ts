import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { Group } from 'src/groups/entity/group.entity';
import { Repository } from 'typeorm';
import { JoinRoomPayloadDto } from './dto/join-room-payload.dto';
import { GroupMessageDto } from './dto/group-message.dto';
import { TypingDto } from './dto/typing.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>
  ){}

  async handleJoin(client: Socket, payload: JoinRoomPayloadDto){
    return await client.join(`${payload.universityId}`)
  }

  async handleGroupMessage(client: Socket, payload: GroupMessageDto){
    return client.to(`${payload.universityId}`).emit('groupMessage', payload)
  }

  async handleTyping(client: Socket, payload: TypingDto){
    return client.to(`${payload.universityId}`).emit('typing', payload)
  }
}
