import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from './universities.entity';
import { Repository } from 'typeorm';
import { CreateUniversityDto } from './dto/create-university.dto';
import {
  Conversation,
  ConversationType,
} from 'src/chat/entities/conversation.entity';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private universityRepo: Repository<University>,

    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
  ) {}

  findAll() {
    return this.universityRepo.find();
  }

  findOne(id: number) {
    return this.universityRepo.findOne({ where: { id } });
  }

  async create(data: CreateUniversityDto) {
    const university = this.universityRepo.create(data);
    const savedUniversity = await this.universityRepo.save(university);

    const conversation = this.conversationRepo.create({
      type: ConversationType.UNIVERSITY,
      university: savedUniversity,
    });
    await this.conversationRepo.save(conversation);

    return savedUniversity;
  }

  async update(id: number, data: Partial<CreateUniversityDto>) {
    await this.universityRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const university = await this.findOne(id);
    if (university) {
      await this.universityRepo.remove(university);
    }
    return university;
  }
}
