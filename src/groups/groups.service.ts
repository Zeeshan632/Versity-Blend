import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ){}

  async createGroup(createGroupDto: CreateGroupDto, userId: number){
    const user = await this.userRepo.findOne({where: {id: userId}, relations: {university: true}})
    const userUniversityId = user.university.id

    const existingGroup = await this.groupRepo.findOne({where: {
      name: createGroupDto.name, university: {id: userUniversityId}
    }})

    if(existingGroup){
      throw new ConflictException(`A group with this specific name '${createGroupDto.name}' already exists in your University!`)
    }
    
    const newGroup = this.groupRepo.create({...createGroupDto, university: user.university, members: [user], admin: user})

    await this.groupRepo.save(newGroup)
    
    return newGroup
  }

  async addMember(groupId: number, userToBeAddedId: number, userId: number){
    const group = await this.groupRepo.findOne({where: {id: groupId}, relations: {admin: true}})
    if(!group){
      throw new NotFoundException('Group does not exist!')
    }

    // check if the user adding another is an admin or not
    if(group.admin.id !== userId){
      throw new ConflictException('Users can be added by admins only!')
    }
    
    const userToBeAdded = await this.userRepo.findOne({where: {id: userToBeAddedId}})
    if(!userToBeAdded){
      throw new NotFoundException('User does not found!')
    }

    // instead of loading all the members, check the existence of the user in the group
    const isMember = await this.groupRepo
      .createQueryBuilder('group')
      .innerJoin('group.members', 'member')
      .where('group.id = :groupId', { groupId })
      .andWhere('member.id = :userToBeAddedId', { userToBeAddedId })
      .getOne();
    
    if(isMember){
      throw new ConflictException('User is already a member of this group!')
    }

    // add the user to the group's members relation
    await this.groupRepo
      .createQueryBuilder()
      .relation(Group, 'members')
      .of(group)
      .add(userToBeAdded)
    
    return {message: 'User added successfully to the group!'}
  }
}
