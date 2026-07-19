import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';

@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService){}

  @Get()
  @ApiOperation({ summary: 'Get all universities' })
  @ApiOkResponse({ description: 'List of universities retrieved' })
  getAll(){
    return this.universitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a university by ID' })
  @ApiOkResponse({ description: 'University details retrieved' })
  getOne(@Param('id') id: number) {
    return this.universitiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new university' })
  @ApiCreatedResponse({ description: 'University created successfully' })
  create(@Body() createUniversityDto: CreateUniversityDto) {
    return this.universitiesService.create(createUniversityDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a university' })
  @ApiOkResponse({ description: 'University updated successfully' })
  update(@Param('id') id: number, @Body() updateUniversityDto: Partial<CreateUniversityDto>) {
    return this.universitiesService.update(id, updateUniversityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a university' })
  @ApiOkResponse({ description: 'University deleted successfully' })
  remove(@Param('id') id: number) {
    return this.universitiesService.remove(id);
  }
}
