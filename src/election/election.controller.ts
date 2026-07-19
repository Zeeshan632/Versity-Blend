import {
    Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ElectionService } from './election.service';
import { AuthenticatedRequest } from 'src/types/express';

@ApiTags('Election')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('election')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @Post('/:electionId/nominate')
  @ApiOperation({ summary: 'Nominate for an election' })
  @ApiCreatedResponse({ description: 'Nomination submitted' })
  nominateForElection(
    @Param('electionId', ParseIntPipe) electionId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.electionService.nominateForElection(
      electionId,
      req.user.userId,
    );
  }

  @Post('/:electionId/vote')
  @ApiOperation({ summary: 'Vote in an election' })
  @ApiCreatedResponse({ description: 'Vote recorded' })
  voteInElection(
    @Param('electionId', ParseIntPipe) electionId: number,
    @Body('candidateId', ParseIntPipe) candidateId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.electionService.voteInElection(electionId, candidateId, req.user.userId)
  }

  @Get('/isElectionHappening/:conversationId')
  @ApiOperation({ summary: 'Check if an election is ongoing in a conversation' })
  @ApiOkResponse({ description: 'Election status retrieved' })
  isElectionHappening(@Param('conversationId', ParseIntPipe) conversationId: number){
    return this.electionService.isElectionHappening(conversationId)
  }
}
