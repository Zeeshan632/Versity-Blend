import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { AddMemberDto } from './dto/add-member.dto';

@ApiTags('Groups')
@ApiBearerAuth('JWT-auth')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService){}

  @Post('create-group')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new group' })
  @ApiCreatedResponse({ description: 'Group created successfully' })
  createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req){
    return this.groupService.createGroup(createGroupDto, +req.user.userId)
  }

  @Post('add-member')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add a member to a group' })
  @ApiCreatedResponse({ description: 'Member added to group' })
  addMember(@Body() addMemberDto: AddMemberDto, @Req() req){
    return this.groupService.addMember(addMemberDto.groupId, addMemberDto.userId, +req.user.userId)
  }
}
