import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from './universities.entity';
import { Repository } from 'typeorm';
import { UniversitiesService } from './universities.service';

const initialUniversities = [
  {
    name: 'Institute of Business Administration',
    domain: 'iba.edu.pk',
    abbreviation: 'IBA',
  },
  { name: 'University of Karachi', domain: 'uok.edu.pk', abbreviation: 'UoK' },
  {
    name: 'Mehran University of Engineering & Technology',
    domain: 'muet.edu.pk',
    abbreviation: 'MUET',
  },
  {
    name: 'NED University of Engineering & Technology',
    domain: 'neduet.edu.pk',
    abbreviation: 'NED',
  },
  { name: 'University of the Punjab', domain: 'pu.edu.pk', abbreviation: 'PU' },
];

export class UniversitySeed implements OnModuleInit {
  constructor(
    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,

    private readonly UniversitiesService: UniversitiesService,
  ) {}

  async onModuleInit() {
    for (const uni of initialUniversities) {
      const exists = await this.universityRepo.findOne({
        where: { domain: uni.domain },
      });

      if (!exists) {
        await this.UniversitiesService.create(uni)
        console.log(`Inserted: ${uni.name}`);
      }
    }
  }
}
