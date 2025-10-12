import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdvisorsService } from './advisors.service';

@Controller('advisors')
export class AdvisorsController {
  constructor(private readonly advisorsService: AdvisorsService) {}

  @Get()
  findAll(
    @Query('estado') estado?: string,
    @Query('especialidad') especialidad?: string,
    @Query('empresa') empresa?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.advisorsService.findAll({
      estado,
      especialidad,
      empresa,
      search,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advisorsService.findOne(id);
  }

  @Get(':id/properties')
  getAdvisorProperties(@Param('id') id: string) {
    return this.advisorsService.getAdvisorProperties(id);
  }
}

