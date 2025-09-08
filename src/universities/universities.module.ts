import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './universities.entity';
import { UniversitySeed } from './universities.seed';

@Module({
  imports: [TypeOrmModule.forFeature([University])],
  providers: [UniversitiesService, UniversitySeed],
  controllers: [UniversitiesController],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
