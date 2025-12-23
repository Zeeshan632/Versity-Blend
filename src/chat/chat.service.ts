import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { Group } from 'src/groups/entity/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>
  ){}

  handleJoin(client: Socket, payload: any){
        
  }
}
