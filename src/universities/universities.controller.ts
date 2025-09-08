import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService){}

  @Get()
  getAll(){
    return this.universitiesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.universitiesService.findOne(id);
  }

  @Post()
  create(@Body() createUniversityDto: CreateUniversityDto) {
    return this.universitiesService.create(createUniversityDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUniversityDto: Partial<CreateUniversityDto>) {
    return this.universitiesService.update(id, updateUniversityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.universitiesService.remove(id);
  }
}
