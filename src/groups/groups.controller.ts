import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService){}

  @Post('create-group')
  @UseGuards(AuthGuard('jwt'))
  createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req){
    return this.groupService.createGroup(createGroupDto, +req.user.userId)
  }

  @Post('add-member')
  @UseGuards(AuthGuard('jwt'))
  addMember(@Body() addMemberDto: AddMemberDto, @Req() req){
    return this.groupService.addMember(addMemberDto.groupId, addMemberDto.userId, +req.user.userId)
  }
}
