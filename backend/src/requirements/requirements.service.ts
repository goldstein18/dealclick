import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { Requirement } from './entities/requirement.entity';

@Injectable()
export class RequirementsService {
  constructor(
    @InjectRepository(Requirement)
    private requirementRepository: Repository<Requirement>,
  ) {}

  async create(createRequirementDto: CreateRequirementDto, userId: string): Promise<Requirement> {
    const requirement = this.requirementRepository.create({
      ...createRequirementDto,
      userId,
    });
    return this.requirementRepository.save(requirement);
  }

  async findAll(filters: any): Promise<{ data: Requirement[]; total: number; page: number; totalPages: number }> {
    const { propertyType, location, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.requirementRepository
      .createQueryBuilder('requirement')
      .leftJoinAndSelect('requirement.user', 'user')
      .orderBy('requirement.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (propertyType && propertyType !== 'Todos') {
      queryBuilder.andWhere('requirement.propertyType = :propertyType', { propertyType });
    }

    if (location && location !== 'Todos') {
      queryBuilder.andWhere('requirement.location LIKE :location', { location: `%${location}%` });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Requirement> {
    const requirement = await this.requirementRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }

    return requirement;
  }

  async findByUser(userId: string): Promise<Requirement[]> {
    return this.requirementRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateRequirementDto: UpdateRequirementDto, userId: string): Promise<Requirement> {
    const requirement = await this.findOne(id);

    if (requirement.userId !== userId) {
      throw new ForbiddenException('You can only update your own requirements');
    }

    Object.assign(requirement, updateRequirementDto);
    return this.requirementRepository.save(requirement);
  }

  async remove(id: string, userId: string): Promise<void> {
    const requirement = await this.findOne(id);

    if (requirement.userId !== userId) {
      throw new ForbiddenException('You can only delete your own requirements');
    }

    await this.requirementRepository.remove(requirement);
  }

  async incrementLikes(id: string): Promise<Requirement> {
    const requirement = await this.findOne(id);
    requirement.likes += 1;
    return this.requirementRepository.save(requirement);
  }
}

