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
import { AuthGuard } from '@nestjs/passport';
import { ElectionService } from './election.service';
import { AuthenticatedRequest } from 'src/types/express';

@UseGuards(AuthGuard('jwt'))
@Controller('election')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @Post('/:electionId/nominate')
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
  voteInElection(
    @Param('electionId', ParseIntPipe) electionId: number,
    @Body('candidateId', ParseIntPipe) candidateId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.electionService.voteInElection(electionId, candidateId, req.user.userId)
  }

  @Get('/isElectionHappening/:conversationId')
  isElectionHappening(@Param('conversationId', ParseIntPipe) conversationId: number){
    return this.electionService.isElectionHappening(conversationId)
  }
}
