import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './universities.entity';
import { UniversitySeed } from './universities.seed';
import { Conversation } from 'src/chat/entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([University, Conversation])],
  providers: [UniversitiesService, UniversitySeed],
  controllers: [UniversitiesController],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
