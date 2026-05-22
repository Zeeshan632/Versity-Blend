import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/groups/entity/group.entity';
import { Repository } from 'typeorm';
import { JoinRoomPayloadDto } from './dto/join-room-payload.dto';
import { GroupMessageDto } from './dto/group-message.dto';
import { TypingDto } from './dto/typing.dto';
import { User } from 'src/user/entity/user.entity';
import { ConnectedClientsService } from 'src/realtime/connected-clients.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly clients: ConnectedClientsService
  ){}


  async sendMessageToUniGroup(client: any, payload: any){
    const allStudentsOfAUni = await this.userRepo.find({where: {university: {id: payload.universityId}}})

    console.log(client.userId)

    allStudentsOfAUni.forEach(student => {
      this.clients.send(student.id, 'uniGroupMessage', {senderId: client.userId, message: payload.message})
    })
  }
}
