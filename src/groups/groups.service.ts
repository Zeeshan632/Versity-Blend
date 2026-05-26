import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { User } from 'src/user/entity/user.entity';
import {
  Conversation,
  ConversationType,
} from 'src/chat/entities/conversation.entity';
import { ConversationParticipant } from 'src/chat/entities/conversation-participant.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto, userId: number) {
    return await this.groupRepo.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: { university: true },
      });

      const userUniversityId = user.university.id;

      const existingGroup = await manager.findOne(Group, {
        where: {
          name: createGroupDto.name,
          university: { id: userUniversityId },
        },
      });

      if (existingGroup) {
        throw new ConflictException(
          `A group with this specific name '${createGroupDto.name}' already exists in your University!`,
        );
      }

      const newGroup = manager.create(Group, {
        ...createGroupDto,
        university: user.university,
        members: [user],
        admin: user,
      });
      const savedGroup = await manager.save(Group, newGroup);

      const conversation = manager.create(Conversation, {
        group: savedGroup,
        type: ConversationType.GROUP,
      });

      const savedConversation = await manager.save(Conversation, conversation);

      const conversationParticipant = manager.create(ConversationParticipant, {
        conversation: savedConversation,
        user: user,
      });

      await manager.save(ConversationParticipant, conversationParticipant);

      return savedGroup;
    });
  }

  async addMember(groupId: number, userToBeAddedId: number, userId: number) {
    return await this.groupRepo.manager.transaction(async manager => {
      
      const group = await manager.findOne(Group, {
        where: { id: groupId },
        relations: { admin: true },
      });
      if (!group) {
        throw new NotFoundException('Group does not exist!');
      }
      
      // check if the user adding another is an admin or not
      if (group.admin.id !== userId) {
        throw new ConflictException('Users can be added by admins only!');
      }
  
      const userToBeAdded = await manager.findOne(User, {
        where: { id: userToBeAddedId },
      });
      if (!userToBeAdded) {
        throw new NotFoundException('User does not found!');
      }
  
      // instead of loading all the members, check the existence of the user in the group
      const isMember = await manager
        .createQueryBuilder(Group, 'group')
        .innerJoin('group.members', 'member')
        .where('group.id = :groupId', { groupId })
        .andWhere('member.id = :userToBeAddedId', { userToBeAddedId })
        .getOne();
  
      if (isMember) {
        throw new ConflictException('User is already a member of this group!');
      }

      // add the user to the group's members relation
      await manager
        .createQueryBuilder()
        .relation(Group, 'members')
        .of(group)
        .add(userToBeAdded);
      
      const conversation = await manager.findOne(Conversation, {where: {group: {id: groupId}}})

      const conversationParticipant = manager.create(ConversationParticipant, {
        conversation,
        user: userToBeAdded
      })

      await manager.save(ConversationParticipant, conversationParticipant)
  
      return { message: 'User added successfully to the group!' };
    })

  }
}
