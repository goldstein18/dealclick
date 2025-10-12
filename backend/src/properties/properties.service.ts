import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, userId: string): Promise<Property> {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      userId,
    });
    return this.propertyRepository.save(property);
  }

  async findAll(filters: any): Promise<{ data: Property[]; total: number; page: number; totalPages: number }> {
    const { type, minPrice, maxPrice, location, beds, baths, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.user', 'user')
      .where('property.hidden = :hidden', { hidden: false })  // Filter out hidden items
      .orderBy('property.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (type && type !== 'Todos') {
      queryBuilder.andWhere('property.propertyType = :type', { type });
    }

    if (location && location !== 'Todos') {
      queryBuilder.andWhere('property.location LIKE :location', { location: `%${location}%` });
    }

    if (beds) {
      queryBuilder.andWhere('property.beds >= :beds', { beds });
    }

    if (baths) {
      queryBuilder.andWhere('property.baths >= :baths', { baths });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findByUser(userId: string): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto, userId: string): Promise<Property> {
    const property = await this.findOne(id);

    if (property.userId !== userId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    Object.assign(property, updatePropertyDto);
    return this.propertyRepository.save(property);
  }

  async remove(id: string, userId: string): Promise<void> {
    const property = await this.findOne(id);

    if (property.userId !== userId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.propertyRepository.remove(property);
  }

  async incrementViews(id: string): Promise<Property> {
    const property = await this.findOne(id);
    property.views += 1;
    return this.propertyRepository.save(property);
  }

  async incrementLikes(id: string): Promise<Property> {
    const property = await this.findOne(id);
    property.likes += 1;
    return this.propertyRepository.save(property);
  }
}

