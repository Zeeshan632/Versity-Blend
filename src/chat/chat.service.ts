import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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



}
