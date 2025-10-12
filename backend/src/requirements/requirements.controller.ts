import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { RequirementsService } from './requirements.service';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRequirementDto: CreateRequirementDto, @Request() req) {
    return this.requirementsService.create(createRequirementDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('propertyType') propertyType?: string,
    @Query('location') location?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.requirementsService.findAll({
      propertyType,
      location,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requirementsService.findOne(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.requirementsService.findByUser(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, 
    @Body() updateRequirementDto: UpdateRequirementDto,
    @Request() req
  ) {
    return this.requirementsService.update(id, updateRequirementDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.requirementsService.remove(id, req.user.id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  like(@Param('id') id: string) {
    return this.requirementsService.incrementLikes(id);
  }
}

