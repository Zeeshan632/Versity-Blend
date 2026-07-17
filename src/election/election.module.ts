import { Module } from '@nestjs/common';
import { ElectionController } from './election.controller';
import { ElectionService } from './election.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Election } from './entity/election.entity';
import { Candidate } from './entity/candidate.entity';
import { Vote } from './entity/vote.entity';
import { Conversation } from 'src/chat/entities/conversation.entity';
import { ConversationParticipant } from 'src/chat/entities/conversation-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Election, Candidate, Vote, Conversation, ConversationParticipant])],
  controllers: [ElectionController],
  providers: [ElectionService],
  exports: [ElectionService]
})
export class ElectionModule {}
