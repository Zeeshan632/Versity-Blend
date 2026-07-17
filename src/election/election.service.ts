import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Election } from './entity/election.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Candidate } from './entity/candidate.entity';
import { Conversation } from 'src/chat/entities/conversation.entity';
import { Vote } from './entity/vote.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class ElectionService {
  constructor(
    @InjectRepository(Election)
    private readonly electionRepository: Repository<Election>,

    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,

    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleElectionCycle() {
    await this.closeExpiredElections();
    await this.startScheduledElection();
  }

  // close election whose end date has passed
  private async closeExpiredElections() {
    const expiredElections = await this.electionRepository.find({
      where: {
        isCompleted: false,
        endDate: LessThan(new Date()),
      },
      relations: { conversation: true },
    });

    for (const election of expiredElections) {
      const winner = await this.voteRepository
        .createQueryBuilder('vote')
        .select('vote.candidateId')
        .addSelect('COUNT(vote.id)', 'voteCount')
        .where('vote.electionId = :electionId', { electionId: election.id })
        .groupBy('vote.candidateId')
        .orderBy('voteCount', 'DESC')
        .limit(1)
        .getRawOne();

      const winningCandidate = await this.candidateRepository.findOne({
        where: { id: winner.vote_candidateId },
        relations: { user: true },
      });

      election.isCompleted = true;
      election.winner = winner ? winningCandidate?.user ?? null : null;
      await this.electionRepository.save(election);

      //schedule the next election
      await this.scheduleNextElection(election.conversation, 27);
    }
  }

  // start elections whose startDate has passed
  private async startScheduledElection() {
    const pendingElections = await this.electionRepository.find({
      where: {
        isCompleted: false,
        startDate: LessThan(new Date()),
      },
    });
  }

  // create a new election for a conversation
  async scheduleNextElection(conversation: Conversation, daysFromNow: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + daysFromNow); // generally after 27 days election would start

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // 3 days voting window

    const election = this.electionRepository.create({
      startDate,
      endDate,
      conversation,
      isCompleted: false,
    });

    return await this.electionRepository.save(election);
  }

  // called when first member joins university group
  async onFirstMemberJoined(conversation: Conversation) {
    await this.scheduleNextElection(conversation, 7); // first election would happen after the first 7 days of first member's joining
  }

  async nominateForElection(electionId: number, userid: number) {
    const candidateAlreadyPresent = await this.candidateRepository.findOne({
      where: {
        election: { id: electionId },
        user: { id: userid },
      },
    });
    if (candidateAlreadyPresent) {
      throw new ConflictException(
        'You are already nominated for this election!',
      );
    }
    const newCandidate = this.candidateRepository.create({
      election: { id: electionId },
      user: { id: userid },
    });

    return await this.candidateRepository.save(newCandidate);
  }

  async voteInElection(
    electionId: number,
    candidateId: number,
    userId: number,
  ) {
    const voteAlreadyCasted = await this.voteRepository.findOne({
      where: {
        election: { id: electionId },
        candidate: { id: candidateId },
        voter: { id: userId },
      },
    });

    if (voteAlreadyCasted) {
      throw new ConflictException('Your vote is already casted!');
    }

    const newVote = this.voteRepository.create({
      election: { id: electionId },
      candidate: { id: candidateId },
      voter: { id: userId },
      votedAt: new Date(),
    });

    return await this.voteRepository.save(newVote);
  }

  async isElectionHappening(conversationId: number) {
    const election = await this.electionRepository.findOne({
      where: {
        conversation: { id: conversationId },
        startDate: LessThan(new Date()),
        endDate: MoreThan(new Date()),
        isCompleted: false,
      },
    });

    if (election) {
      return election;
    }
    return { message: 'No any election is happening right now!' };
  }
}
